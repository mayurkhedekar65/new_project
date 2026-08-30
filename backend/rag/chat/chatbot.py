import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnableLambda, RunnablePassthrough, RunnableParallel
from rag.schemas.chatbot_schema import ChatResponse
from rag.schemas.report_output_schema import ReportValuesResponse
from rag.schemas.summary_output_schema import ReportSummaryOutput
from rag.schemas.comparison_summary_output_schema import ReportComparisonOutput
from rag.vector.vector_store import create_or_get_vector_db

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")


model = ChatGoogleGenerativeAI(model="gemini-3-flash-preview",temperature=0)
structured_model1 = model.with_structured_output(ReportValuesResponse)
structured_model2 = model.with_structured_output(ReportSummaryOutput)
structured_model3 = model.with_structured_output(ChatResponse)
structured_model4 = model.with_structured_output(ReportComparisonOutput)


# extracts the report values from the document
async def extract_report_values(report_text):
    prompt = PromptTemplate(
        template="""
    You are a medical report information extraction assistant.

    Extract the laboratory values from the given medical report text.

    Report Text:
    {report_data}

    Extract the following parameters:
    - Hemoglobin
    - WBC count
    - Platelet count
    - Blood sugar
    - HbA1c
    - Total cholesterol
    - HDL cholesterol
    - LDL cholesterol
    - Triglycerides
    - Creatinine
    - eGFR
    - AST/SGOT
    - ALT/SGPT
    - TSH
    - Vitamin D

    Instructions:
    - Extract only the values present in the report.
    - Map different names of the same test correctly (example: Hb = Hemoglobin, SGOT = AST, SGPT = ALT).
    - Return null for any value that is not available in the report.
    - Extract numeric values only, without units.
    - Do not calculate or estimate missing values.
    - Do not provide explanations.
    - Do not summarize the report.
    """,
        input_variables=["report_data"]
    )
    final_chain = prompt | structured_model1
    response = await final_chain.ainvoke({"report_data": report_text})

    if not response:
        return None
    else:
        return response


# generates summary based on report values
async def generate_summary(report_dict):
    prompt = PromptTemplate(
    template="""
    You are an experienced medical report analysis assistant.

    The following is a patient's blood test report as a Python dictionary.

    Blood Test Report:
    {report_data}

    Analyze the available blood test results and provide a concise, patient-friendly interpretation.

    Your response must contain the following:

    1. Summary
    Provide a concise overall summary of the blood report. Mention whether the available results are generally reassuring and highlight the most important concern if one exists.

    2. Overall Summary
    Provide a slightly more detailed interpretation of the overall report. Do not repeat every laboratory value because the values are already displayed separately.

    3. Key Findings
    List only the most important findings from the report.
    Focus on abnormal, borderline, or clinically relevant results.
    Do not list every normal result.
    If all available results are within typical reference ranges, state that the available results are generally within the expected range.

    4. Recommendations
    Provide practical and patient-friendly recommendations based on the findings.
    Include relevant diet and lifestyle recommendations.
    Do not prescribe medications or specific supplement doses.
    Do not give recommendations that are unrelated to the patient's findings.

    5. Follow-up
    Suggest important follow-up actions or tests only when appropriate based on the findings.
    If no specific follow-up is needed, return an empty list.

    Guidelines:
    - Analyze all available parameters before generating the summary.
    - Use standard adult reference ranges as general guidance, while recognizing that laboratory reference ranges may vary.
    - Use simple, patient-friendly language.
    - Be accurate and evidence-based.
    - Do not make a definitive diagnosis.
    - Do not prescribe medications.
    - Do not invent missing values.
    - If a value is null or unavailable, do not interpret it.
    - Avoid unnecessary repetition of laboratory values.
    - Do not provide a separate explanation of what every test measures.
    - Do not overstate risks or causes.
    - Recommendations should be appropriate to the specific findings.
    - If there is an abnormal result, recommend discussing it with a healthcare professional when appropriate.

    Formatting:
    - Return the content as plain text.
    - Do not use Markdown.
    - Do not use #, *, -, bullets, numbered lists, or other Markdown formatting.
    - Use simple headings and sentences.
    - Do not use Markdown formatting inside any field.
    - Each item in key_findings, recommendations, and follow_up should be a plain-text sentence without bullet characters.

    Return only the requested structured output.

    """,
    input_variables=["report_data"],
    )
    final_chain = prompt | structured_model2 
    response = await final_chain.ainvoke({"report_data": report_dict})

    if not response:
        return None
    else:
        return response


# joints the documents text to form context
def join_text(retrieved_docs):
    context = "\n\n".join(doc.page_content for doc in retrieved_docs)
    return context


# answers the user query based on context
async def answer_user_query(user_id, file_id, user_message, chat_history):
    vector_db = create_or_get_vector_db()
    retriever = vector_db.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 5},
        filter={
            'user_id': user_id,
            'file_id': file_id
        }
    )

    prompt = PromptTemplate(
        template="""
    You are an AI assistant specializing in explaining medical laboratory reports.

    Medical Report Context:
    {context}

    Previous Chat History:
    {chat_history}

    User Question:
    {question}

    Instructions:
    - The medical report context has been retrieved from a knowledge base. Base your answer only on the information in the provided context.
    - Answer the user's question clearly and accurately.
    - If the question refers to a lab test, explain:
    - What the test measures.
    - What the reported value indicates.
    - Whether the value appears Low, Normal, Borderline, or High (using commonly accepted adult reference ranges, when appropriate).
    - General lifestyle, diet, and precautionary measures if the value is abnormal.
    - If the user asks for an overall report summary, summarize all the available findings from the provided context.
    - Do not make a definitive diagnosis.
    - Do not prescribe medications.
    - If the required information is not present in the context, reply:
    "I don't know based on the provided medical report."

    Answer in a clear, patient-friendly manner.
    
    Return the summary as plain text:
    - Do not use Markdown.
    - Do not use #, *, -, or other Markdown formatting.
    - Use simple headings and sentences.
    """,
        input_variables=["context", "question", "chat_history"],
    )

    parallel_chain = RunnableParallel({
        "context":  RunnableLambda(lambda x: x["question"])| retriever | RunnableLambda(join_text),
        "question": RunnablePassthrough(),
        "chat_history": RunnableLambda(lambda x: x["chat_history"])
    })

    final_chain = parallel_chain | prompt | structured_model3 

    response = await final_chain.ainvoke({
        "question": user_message,
        "chat_history": chat_history
    })

    if not response:
        return None
    else:
        return response.ai


# generates summary based on comparison of two report values
async def generate_comparison_summary(old_report_data, recent_report_data):
    prompt = PromptTemplate(
    template="""
    You are an experienced medical report analysis assistant specializing in comparing laboratory reports over time.

    The patient has provided two blood test reports.

    Previous Blood Test Report:
    {old_report_data}

    Recent Blood Test Report:
    {recent_report_data}

    Compare the previous and recent reports and identify the most important changes.

    Your response must contain the following:

    1. Overall Summary
    Provide a concise summary of the overall changes between the previous and recent reports.
    Mention whether the overall health indicators appear to be improving, stable, or worsening.
    Highlight the most significant positive or concerning changes.

    2. Key Changes
    List only the important changes between the two reports.
    Include:
    Improved results.
    Worsened results.
    Previously abnormal results that have improved or returned to the expected range.
    New abnormal findings.
    Important stable findings when clinically relevant.

    Do not list every parameter.
    Do not repeat changes that are already clearly shown in the comparison table.
    Do not include minor numerical changes unless they are medically relevant.

    3. Recommendations
    Provide practical recommendations based on the important changes.
    Include relevant diet and lifestyle recommendations when appropriate.
    Focus on maintaining improvements and addressing concerning trends.
    Do not prescribe medications or specific supplement doses.

    4. Follow-up
    Suggest follow-up actions or tests only when appropriate.
    Consider persistent abnormalities, worsening trends, newly abnormal findings, or previously abnormal results that require monitoring.
    If no specific follow-up is needed, return an empty list.

    Guidelines:
    Analyze all available parameters before generating the comparison summary.
    Use standard adult reference ranges as general guidance.
    Laboratory reference ranges may vary between laboratories.
    Focus on trends and clinically meaningful changes rather than small numerical differences.
    If a parameter exists only in one report, do not treat the absence of the previous value as a worsening or improvement.
    If a value is missing, null, or unavailable, do not make assumptions about it.
    Do not invent values or medical history.
    Use simple, patient-friendly language.
    Be accurate and evidence-based.
    Do not make a definitive diagnosis.
    Do not prescribe medications.
    Avoid unnecessary repetition of laboratory values.
    Avoid alarming language and explain findings in a balanced manner.
    If the latest report is generally reassuring, clearly state that and provide appropriate preventive advice.

    Formatting:
    Return the content as plain text.
    Do not use Markdown.
    Do not use #, *, -, bullets, numbered lists, or other Markdown formatting.
    Do not include a parameter-wise comparison table.
    Do not include individual parameter explanations unless they are necessary to explain an important change.
    Each item in key_changes, recommendations, and follow_up must be a plain-text sentence without bullet characters.

    Return only the requested structured output.
    """,
    input_variables=["old_report_data", "recent_report_data"],
    )

    final_chain = prompt | structured_model4 
    response = await final_chain.ainvoke({
        "old_report_data": old_report_data,
        "recent_report_data": recent_report_data})

    if not response:
        return None
    else:
        return response
