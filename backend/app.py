import asyncio
from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, WebSocket, WebSocketDisconnect, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, delete
from middleware.cors import middleware
from schemas.user_schema import UserSchema
from schemas.user_profile_schema import UserProfileSchema
from schemas.user_login_schema import UserLoginSchema
from schemas.reset_mail_schema import ResetMailSchema
from schemas.feedback_schema import FeedbackSchema
from schemas.verify_otp_schema import VerifyOtpSchema
from schemas.set_new_password_schema import SetNewPasswordSchema
from schemas.report_schema import ReportDetailsSchema
from sql.models.user_model import User
from sql.models.file_model import UploadedFile
from sql.models.report_model import ReportDetails
from sql.models.comparison_model import ReportComparison
from sql.models.chats_model import Chats
from db.db_connection import create_db_connection
from auth.hash_password import hash_password, verify_password
from auth.jwt_token import create_token, get_current_user
from rag.extractor.extract_document_text import extract_document_text
from rag.extractor.extract_image_text import extract_image_text
from rag.chunks.generate_chunks import create_chunks
from rag.vector.vector_store import create_or_get_vector_db
from rag.chat.chatbot import extract_report_values, generate_summary, answer_user_query, generate_comparison_summary, join_text
from cache.redis_client import redis_connection
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from services.email_service import create_mail, email_worker
from services.otp_generation import generate_otp, otp_key
from cache.redis_client import redis_connection
from datetime import date
from pathlib import Path
from contextlib import asynccontextmanager


# manages the application startup & shutdown lifecycle
@asynccontextmanager
async def lifespan(app: FastAPI):
    worker_task = asyncio.create_task(email_worker())
    yield
    worker_task.cancel()

    try:
        await worker_task
    except asyncio.CancelledError:
        pass
    finally:
        await redis.aclose()


# app initialise
app = FastAPI(lifespan=lifespan)


# redis client connection
redis = redis_connection()


# middleware
middleware(app)


# file path
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


# checks whether new or older user & then register's user
@app.post("/auth/signup")
async def create_user(user: UserSchema, db: AsyncSession = Depends(create_db_connection)):
    user_name = user.name
    user_email = user.email
    user_gender = user.gender
    user_age = user.age
    user_password = user.password

    try:
        user_query = await db.execute(select(User).where(User.email == user_email))
        is_old_user = user_query.mappings().first()

        if is_old_user is None:
            new_user = User(name=user_name, email=user_email, gender=user_gender, age=user_age,
                            password=hash_password(user_password))
            db.add(new_user)
            await db.commit()
            await db.refresh(new_user)

            email_sub = "Registration Successful"
            email_body = f"""
            Hello {user_name},

            Your registration has been completed successfully, and your account has been activated.

            You can now sign in and access our services.

            If you have any questions or require assistance, please don't hesitate to contact our support team.

            Thank you for choosing us.

            Best regards,
            
            Diagnostic AI Tech Team
            """
            await create_mail(email_sub, user_email, email_body)

            return {"message": "registered successfully !"}

        else:
            return HTTPException(status_code=status.HTTP_409_CONFLICT, detail="user already exist !")

    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="registration failed !")


# checks credentials & login's the user
@app.post("/auth/signin")
async def login(user: UserLoginSchema, db: AsyncSession = Depends(create_db_connection)):
    user_email = user.email
    user_password = user.password

    try:
        user_query = await db.execute(select(User).where(User.email == user_email))
        is_old_user = user_query.mappings().first()
        old_user_data = is_old_user["User"]

        if is_old_user is None or not verify_password(user_password, old_user_data.password):
            return HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid credentials !")

        else:
            user_name = old_user_data.name
            token = create_token({"sub": old_user_data.email})
            return {"message": "login successfully !", "access_token": token, "user_name": user_name}

    except:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="login failed !")


# deletes user account & its history
@app.delete("/auth/delete")
async def delete_profile(current_user=Depends(get_current_user), db: AsyncSession = Depends(create_db_connection)):
    user_id = current_user.id

    try:
        user_query = await db.execute(select(User).where(User.id == user_id))
        is_old_user = user_query.mappings().first()

        if is_old_user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="profile not found !")
        else:
            await db.execute(delete(User).where(User.id == user_id))
            await db.commit()
            return {"message": "profile deleted successfully !"}
    except:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="failed to delete profile !")


# updates user account details
@app.put("/auth/update-profile")
async def update_profile(user: UserProfileSchema, current_user=Depends(get_current_user), db: AsyncSession = Depends(create_db_connection)):
    user_id = current_user.id
    user_name = user.name
    user_email = user.email
    user_gender = user.gender
    user_age = user.age

    try:
        user_query = await db.execute(select(User).where(User.id == user_id))
        is_old_user = user_query.mappings().first()

        if is_old_user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="profile not found !")
        else:
            old_user_data = is_old_user["User"]
            old_user_data.name = user_name
            old_user_data.email = user_email
            old_user_data.gender = user_gender
            old_user_data.age = user_age

            await db.commit()
            await db.refresh(old_user_data)
            return {"message": "profile updated successfully !"}
    except:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="failed to updated profile !")


# sends reset password mail to user
@app.post("/auth/reset-password")
async def reset_password(email: ResetMailSchema, db: AsyncSession = Depends(create_db_connection)):
    user_email = email.user_email

    try:
        user_query = await db.execute(select(User).where(User.email == user_email))
        is_old_user = user_query.scalars().first()

        if is_old_user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="profile not found !")
        else:
            otp = generate_otp()
            redis = redis_connection()
            await redis.set(otp_key(user_email), otp, ex=60)
            user_name = is_old_user.name
            email_sub = "Reset Your Password"
            email_body = f"""
            Hello {user_name},

            We received a request to reset your password.

            Use the One-Time Password (OTP) below to reset your password:

            OTP: {otp}

            This OTP is valid for 10 minutes. If you did not request a password reset, you can safely ignore this email.
            Your account will remain secure.

            Thank you,
            
            Diagnostic AI Tech Team
            """

            await create_mail(email_sub, user_email, email_body)

            return {"message": "reset password mail sent successfully !"}

    except:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="failed to sent reset email !")


# verify otp entered by user
@app.post("/auth/verify-otp")
async def verify_otp(data: VerifyOtpSchema):
    user_email = data.user_email
    user_entered_otp = data.otp

    try:
        redis = redis_connection()
        is_otp = int(await redis.get(otp_key(user_email)))

        if not is_otp:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="otp not found !")

        elif user_entered_otp == is_otp:
            await redis.delete(otp_key(user_email))

        return {"message": "otp verified successfully !"}

    except:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="failed to verify otp !")


# update password of the user
@app.post("/auth/update-password")
async def update_password(data: SetNewPasswordSchema, db: AsyncSession = Depends(create_db_connection)):
    user_email = data.user_email
    user_new_password = data.user_password

    try:
        user_query = await db.execute(select(User).where(User.email == user_email))
        is_old_user = user_query.scalars().first()

        if is_old_user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="profile not found !")
        else:
            is_old_user.password = hash_password(user_new_password)
            await db.commit()
            await db.refresh(is_old_user)

            user_email = is_old_user.email
            user_name = is_old_user.name
            email_sub = "Password Reset Successful"
            email_body = f"""
            Hello {user_name},

            Your password has been reset successfully for the account associated with email address {user_email}.

            You can now log in using your new password.

            If you did not make this change, please contact our support team immediately to secure your account.

            Thank you,
            
            Diagnostic AI Tech Team
            """

            await create_mail(email_sub, user_email, email_body)

            return {"message": "password updated successfully !"}

    except:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="failed to update password !")


# gets user profile data
@app.get("/auth/get-profile")
async def update_password(current_user=Depends(get_current_user), db: AsyncSession = Depends(create_db_connection)):
    user_id = current_user.id

    try:
        user_query = await db.execute(select(User.name, User.email, User.gender, User.age).where(User.id == user_id))
        is_old_user = user_query.mappings().first()

        if is_old_user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="profile not found !")
        else:
            return {"message": "profile data fetched successfully !", "user_profile_data": is_old_user}

    except:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="failed to fetch profile data !")


# sends feedback mail to tech team
@app.post("/public/feedback")
async def send_feedback(feedback: FeedbackSchema):
    user_name = feedback.user_name
    user_email = feedback.user_email
    user_feedback = feedback.user_feedback

    try:
        email_sub = "Feedback for Your Website"
        email_body = f"""
        Hello Tech Team,

        I would like to share the following feedback regarding your website.

        Name: {user_email}
        
        Feedback:
        {user_feedback}

        Thank you for taking the time to review my feedback. I appreciate your efforts to improve the website.

        Best regards,
        {user_name}
        """

        await create_mail(email_sub, user_email, email_body)

        return {"message": "feedback sent successfully !"}

    except:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="failed to send feedback email !")


# process the doument & create embeddings and store it in a vector db
@app.post("/chats/upload-file")
async def upload_file(file: UploadFile = File(...), current_user=Depends(get_current_user), db: AsyncSession = Depends(create_db_connection)):
    user_id = current_user.id
    file_name = file.filename
    file_path = f"{UPLOAD_DIR}/{file_name}"
    file_extension = Path(file_name).suffix

    try:
        if not file_name:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="file not found !")

        doc_query = await db.execute(select(UploadedFile).where(UploadedFile.user_id == user_id,
                                                                UploadedFile.file_name == file_name))
        is_old_doc = doc_query.mappings().first()

        if is_old_doc is None:
            with open(file_path, "wb") as buffer:
                buffer.write(await file.read())

            new_doc = UploadedFile(user_id=user_id, file_name=file_name,
                                   file_path=file_path, upload_date=date.today())
            db.add(new_doc)
            await db.commit()
            await db.refresh(new_doc)
        else:
            return {"message": "embeddings already exist !"}

        if file_extension.lower() == ".pdf":
            document_report_text = extract_document_text(file_path)
            extracted_text = join_text(document_report_text)

        elif file_extension.lower() in [".jpg", ".png"]:
            extracted_text = extract_image_text(file_path)

        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported file type")

        response = await extract_report_values(extracted_text)

        if response is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="failed to extract report values !")

        new_report = ReportDetailsSchema(hemoglobin=response.hemoglobin,
                                         wbc_count=response.wbc_count,
                                         platelet_count=response.platelet_count,
                                         blood_sugar=response.blood_sugar,
                                         hba1c=response.hba1c,
                                         total_cholesterol=response.total_cholesterol,
                                         hdl_cholesterol=response.hdl_cholesterol,
                                         ldl_cholesterol=response.ldl_cholesterol,
                                         triglycerides=response.triglycerides,
                                         creatinine=response.creatinine,
                                         egfr=response.egfr,
                                         ast_sgot=response.ast_sgot,
                                         alt_sgpt=response.alt_sgpt,
                                         tsh=response.tsh,
                                         vitamin_d=response.vitamin_d)

        report_json = new_report.model_dump_json()
        report_dict = new_report.model_dump()
        summary_response = await generate_summary(report_json)

        if summary_response is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="failed to generate summary !")

        new_doc_id = new_doc.id
        current_report = ReportDetails(**report_dict)
        current_report.file_id = new_doc_id
        current_report.extracted_text = extracted_text
        current_report.summary = summary_response.summary
        current_report.key_findings = summary_response.key_findings
        current_report.recommendations = summary_response.recommendations
        current_report.follow_up = summary_response.follow_up

        db.add(current_report)
        await db.commit()
        await db.refresh(current_report)

        documents = create_chunks(extracted_text)
        chunks_ids = []

        for i, doc in enumerate(documents):
            doc.metadata["source"] = file_name
            doc.metadata["user_id"] = user_id
            doc.metadata["file_id"] = new_doc_id
            chunks_ids.append(f"{file_name}_{i}")

        vector_db = create_or_get_vector_db()
        vector_db.add_documents(documents, ids=chunks_ids)

        return {"message": "summary & embeddings generated successfully !",
                "file_id": new_doc_id}

    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="failed to upload report file !")


# processes user query & gives answer based on query
@app.websocket("/chats/document-chat")
async def chat(websocket: WebSocket, db: AsyncSession = Depends(create_db_connection)):
    token = websocket.query_params.get("token")

    if not token:
        websocket.close(code=1008)

    current_user = await get_current_user(token, db)
    user_id = current_user.id
    file_id = None
    chat_history = [SystemMessage(content="You are a helpful assistant.")]
    await websocket.accept()

    try:
        while True:
            user_data = await websocket.receive_json()
            if file_id is None:
                file_id = user_data["file_id"]

            user_message = user_data["message"]
            chat_history.append(HumanMessage(content=user_message))
            ai_response = await answer_user_query(
                user_id, file_id, user_message, chat_history)

            if ai_response is None:
                await websocket.send_text("sorry server is busy !")

            else:
                chat_history.append(AIMessage(content=ai_response))
                await websocket.send_json({
                    "type": "message",
                    "ai_msg": ai_response
                })

                new_message = Chats(user_id=user_id, file_id=file_id,
                                    user_msg=user_message, ai_msg=ai_response)
                db.add(new_message)
                await db.commit()
                await db.refresh(new_message)

    except WebSocketDisconnect as e:
        print(f"user disconnected. close code: {e.code}. ")


# gets chats files history of all files
@app.get("/chats/get-chats-files")
async def get_chats(current_user=Depends(get_current_user), db: AsyncSession = Depends(create_db_connection)):
    user_id = current_user.id

    try:
        files_query = await db.execute(select(UploadedFile.id, UploadedFile.file_name, UploadedFile.upload_date).where(UploadedFile.user_id == user_id)
                                       .order_by(desc(UploadedFile.upload_date), desc(UploadedFile.id)))
        is_files = files_query.mappings().all()

        if is_files is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="chats files history not found !")
        else:
            return {"message": "chats files history fetched successfully !", "chats_files": is_files}
    except:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="failed to fetched chats files history !")


# gets specific file chats history
@app.get("/chats/get-chats/{id}")
async def get_chats(id: int, current_user=Depends(get_current_user), db: AsyncSession = Depends(create_db_connection)):
    user_id = current_user.id

    try:
        chats_query = await db.execute(select(Chats.user_msg, Chats.ai_msg).where(
            Chats.user_id == user_id, Chats.file_id == id))
        is_chats = chats_query.mappings().all()

        if is_chats is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="chats history not found !")
        else:
            return {"message": "chats history fetched successfully !", "chats_history": is_chats}
    except:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="failed to fetched chats history !")


# deletes specific chat history & file
@app.delete("/chats/delete-chat/{id}")
async def delete_chat(id: int, current_user=Depends(get_current_user), db: AsyncSession = Depends(create_db_connection)):
    user_id = current_user.id

    try:
        file_query = await db.execute(select(UploadedFile).where(
            UploadedFile.id == id, UploadedFile.user_id == user_id))

        is_file = file_query.mappings().first()

        if is_file is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="file not found !")
        else:
            await db.execute(delete(UploadedFile).where(
                UploadedFile.id == id, UploadedFile.user_id == user_id))
            await db.commit()
            return {"message": "chats history deleted successfully !"}

    except:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="failed to delete chat history !")


# gets all reports of user
@app.get("/analysis/get-reports")
async def get_reports(current_user=Depends(get_current_user), db: AsyncSession = Depends(create_db_connection)):
    user_id = current_user.id

    try:
        reports_query = await db.execute(select(UploadedFile.file_name, UploadedFile.upload_date, ReportDetails.id, ReportDetails.hemoglobin,
                                                ReportDetails.wbc_count, ReportDetails.platelet_count, ReportDetails.blood_sugar, ReportDetails.hba1c,
                                                ReportDetails.total_cholesterol, ReportDetails.hdl_cholesterol, ReportDetails.ldl_cholesterol,
                                                ReportDetails.triglycerides, ReportDetails.creatinine, ReportDetails.egfr, ReportDetails.ast_sgot,
                                                ReportDetails.alt_sgpt, ReportDetails.tsh, ReportDetails.vitamin_d,
                                                ReportDetails.summary, ReportDetails.key_findings, ReportDetails.recommendations,
                                                ReportDetails.follow_up)
                                         .join(ReportDetails, UploadedFile.id == ReportDetails.file_id)
                                         .where(UploadedFile.user_id == user_id)
                                         .order_by(desc(UploadedFile.upload_date), desc(UploadedFile.id))
                                         )
        is_reports = reports_query.mappings().all()

        if is_reports is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="report not found !")
        else:
            return {"message": "latest report fetched successfully !", "latest_report": is_reports}
    except:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="failed to fetch latest reports !")


# gets latests two reports of user
@app.get("/comparison/get-reports")
async def get_reports(current_user=Depends(get_current_user), db: AsyncSession = Depends(create_db_connection)):
    user_id = current_user.id

    try:
        reports_query = await db.execute(select(UploadedFile.file_name, UploadedFile.upload_date, ReportDetails.id, ReportDetails.hemoglobin, ReportDetails.wbc_count,
                                                ReportDetails.platelet_count, ReportDetails.blood_sugar, ReportDetails.hba1c, ReportDetails.total_cholesterol,
                                                ReportDetails.hdl_cholesterol, ReportDetails.ldl_cholesterol, ReportDetails.triglycerides, ReportDetails.creatinine,
                                                ReportDetails.egfr, ReportDetails.ast_sgot, ReportDetails.alt_sgpt, ReportDetails.tsh, ReportDetails.vitamin_d)
                                         .join(UploadedFile, UploadedFile.id == ReportDetails.file_id)
                                         .where(UploadedFile.user_id == user_id)
                                         .order_by(desc(UploadedFile.upload_date), desc(UploadedFile.id))
                                         .limit(2))
        is_reports = reports_query.mappings().all()

        if is_reports is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="reports not found !")
        else:
            recent_report_data = is_reports[0]
            old_report_data = is_reports[1]
            comparison_query = await db.execute(select(ReportComparison).where(ReportComparison.user_id == user_id,
                                                                               ReportComparison.previous_report_id == old_report_data.id,
                                                                               ReportComparison.new_report_id == recent_report_data.id))
            is_old_comparison = comparison_query.mappings().first()

            if is_old_comparison is None:
                return {"message": "latest reports fetched successfully !", "latest_reports": is_reports}
            else:
                old_comparison_data = is_old_comparison["ReportComparison"]

                return {"message": "latest reports and  comparison summary fetched successfully !",
                        "latest_reports": is_reports,
                        "comparison_summary": old_comparison_data.summary,
                        "key_changes": old_comparison_data.key_changes,
                        "recommendations": old_comparison_data.recommendations,
                        "follow_up": old_comparison_data.follow_up}

    except:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="failed to fetch latest reports !")


# compares the reports and generate summary based on the values present in report
@app.post("/comparison/compare-reports")
async def compare_reports(current_user=Depends(get_current_user), db: AsyncSession = Depends(create_db_connection)):
    user_id = current_user.id

    try:
        reports_query = await db.execute(select(ReportDetails.id, ReportDetails.hemoglobin, ReportDetails.wbc_count, ReportDetails.platelet_count,
                                                ReportDetails.blood_sugar, ReportDetails.hba1c, ReportDetails.total_cholesterol,
                                                ReportDetails.hdl_cholesterol, ReportDetails.ldl_cholesterol, ReportDetails.triglycerides,
                                                ReportDetails.creatinine, ReportDetails.egfr, ReportDetails.ast_sgot, ReportDetails.alt_sgpt,
                                                ReportDetails.tsh, ReportDetails.vitamin_d)
                                         .join(UploadedFile, UploadedFile.id == ReportDetails.file_id)
                                         .where(UploadedFile.user_id == user_id)
                                         .order_by(desc(UploadedFile.upload_date), desc(UploadedFile.id))
                                         .limit(2))
        is_reports = reports_query.mappings().all()

        if is_reports is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="reports not found !")
        elif len(is_reports) == 1:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="cannot generate a reports comparison summary !")
        else:
            recent_report_data = is_reports[0]
            old_report_data = is_reports[1]
            comparison_query = await db.execute(select(ReportComparison).where(ReportComparison.user_id == user_id,
                                                                               ReportComparison.previous_report_id == old_report_data.id,
                                                                               ReportComparison.new_report_id == recent_report_data.id))
            is_old_comparison = comparison_query.mappings().first()

            if is_old_comparison is None:
                summary_response = await generate_comparison_summary(
                    old_report_data, recent_report_data)

                if summary_response is None:
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="failed to generate summary !")
                else:
                    new_comparison = ReportComparison(user_id=user_id,
                                                      previous_report_id=old_report_data.id, new_report_id=recent_report_data.id,
                                                      summary=summary_response.summary, key_changes=summary_response.key_changes,
                                                      recommendations=summary_response.recommendations, follow_up=summary_response.follow_up)
                    db.add(new_comparison)
                    await db.commit()
                    await db.refresh(new_comparison)

                    return {"message": "reports comparison summary generated successfully !",
                            "comparison_summary": summary_response.summary,
                            "key_changes": summary_response.key_changes,
                            "recommendations": summary_response.recommendations,
                            "follow_up": summary_response.follow_up}
            else:
                old_comparison_data = is_old_comparison["ReportComparison"]

                return {"message": "comparison summary already exist !",
                        "comparison_summary": old_comparison_data.summary,
                        "key_changes": old_comparison_data.key_changes,
                        "recommendations": old_comparison_data.recommendations,
                        "follow_up": old_comparison_data.follow_up}

    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="failed to fetch lastest reports !")
