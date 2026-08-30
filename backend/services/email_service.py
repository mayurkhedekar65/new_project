import json
import asyncio
from fastapi_mail import ConnectionConfig, FastMail
from fastapi_mail import MessageSchema, MessageType
from core.email_config import settings
from cache.redis_client import redis_connection


# mail connection config
conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
)

fm = FastMail(conf)


# redis client connection
redis = redis_connection()


# queue key
QUEUEKEY = "queue:emails"


# creates email job
async def create_mail(email_sub, recipient_email, email_body):
    job = {
        "email_sub": email_sub,
        "recipient_email": recipient_email,
        "email_body": email_body
    }
    await redis.lpush(QUEUEKEY, json.dumps(job))


# sends email to reciptent
async def send_mail():
    raw = await redis.rpop(QUEUEKEY)
    if not raw:
        return {"message": "no jobs in the queue !"}
    else:
        data = json.loads(raw)
        message = MessageSchema(
            subject=data["email_sub"],
            recipients=[data["recipient_email"]],
            body=data["email_body"],
            subtype=MessageType.plain
        )
        await fm.send_message(message)
        
        return {"message": "mailed send successfully !"}


# email worker continuously check redis email queue and send email if found
async def email_worker():
    while True:
        await send_mail()
        await asyncio.sleep(1)
