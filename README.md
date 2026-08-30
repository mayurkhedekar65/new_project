# Diagnostic AI

Diagnostic AI is an AI-powered blood-report analysis platform that helps users upload, understand, track, compare, and chat with their medical reports.

The application combines OCR, AI summarization, RAG, document processing, authentication, OTP/password-reset flows, email services, and report history into a single full-stack platform.

---

## Features

### Blood Report Upload

- Upload blood reports as **PDF** or **image** files.
- Extract report information automatically.
- Store report metadata and extracted values.

### OCR-Based Extraction

- Uses **EasyOCR** to extract text from uploaded report images.
- Extracts important blood-report parameters such as:
  - Hemoglobin
  - WBC count
  - Platelet count
  - Blood sugar
  - And other supported parameters

### AI Report Summary

- Generates an AI-powered summary for uploaded reports.
- Presents important observations in a user-friendly format.

### Report History

- Maintains historical blood-report values.
- Allows users to view previously uploaded reports.

### Report Comparison

- Compares the latest report with previous reports.
- Highlights changes in blood parameters.
- Generates an automatic comparison summary.

### Chat With Reports

- Users can ask questions about uploaded reports.
- Uses **RAG (Retrieval-Augmented Generation)** to retrieve relevant document information.
- Uses **LangChain + ChromaDB** for document retrieval and vector search.

### Authentication & Account Management

- User registration and login.
- OTP verification.
- Password reset.
- Profile settings.
- Account deletion.
- Email notifications.

### Redis

Redis is used for:

- OTP storage
- OTP expiration
- Password-reset flows
- Background email queue support

### Email Services

Email functionality can be used for:

- Registration emails
- OTP emails
- Password-reset emails
- Feedback emails

---

## Tech Stack

- **Frontend:** Next.js, Tailwind CSS
- **Backend:** FastAPI, REST API, WebSocket
- **Database:** PostgreSQL
- **AI/RAG:** LangChain, ChromaDB, Gemini
- **OCR:** EasyOCR
- **Cache/OTP:** Redis
- **Email:** SMTP / FastAPI-Mail
- **Migrations:** Alembic
- **Containerization:** Docker

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/Abhiraj05/Diagnostic-AI
```

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL
- Redis
- Docker Desktop

### Backend

```bash
cd backend

python -m venv venv
venv\Scripts\activate

pip install --upgrade pip
pip install -r requirements.txt
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## `.env`

Create `backend/.env`:

```env
MAIL_USERNAME=''
MAIL_PASSWORD=''
MAIL_FROM=''
MAIL_PORT='587'
MAIL_SERVER='smtp.gmail.com'

DATABASE_URL='postgresql+asyncpg://postgres:@localhost:5432/diagnostic_ai'
REDIS_URL='redis://localhost:6379/0'

GOOGLE_API_KEY=''
SECRET_KEY=''
```

Replace the empty values with your actual credentials.

For Gmail, use an **App Password** for `MAIL_PASSWORD`.

## PostgreSQL

Create the database:

```sql
CREATE DATABASE diagnostic_ai;
```

The application uses:

```env
DATABASE_URL='postgresql+asyncpg://postgres:@localhost:5432/diagnostic_ai'
```

## Alembic Migration

After changing SQLAlchemy models:

```bash
# PostgreSQL Database Configuration

# Update the `sqlalchemy.url` in your Alembic configuration with your PostgreSQL database credentials:

sqlalchemy.url = postgresql+psycopg://USERNAME:PASSWORD@HOST:PORT/DATABASE
alembic revision --autogenerate -m "update database"
alembic upgrade head
```



## Redis

Local Redis:

```bash
redis-server
redis-cli ping
```

Expected:

```text
PONG
```

Docker:

```bash
docker run -d --name diagnostic-ai-redis -p 6379:6379 redis:7-alpine
```

## FastAPI Mail

Install:

```bash
pip install fastapi-mail
```

Gmail SMTP settings:

```env
MAIL_USERNAME='your-email@gmail.com'
MAIL_PASSWORD='your-app-password'
MAIL_FROM='your-email@gmail.com'
MAIL_PORT='587'
MAIL_SERVER='smtp.gmail.com'
```

## Run FastAPI

```bash
cd backend
uvicorn app.main:app --reload
```

API:

```text
http://localhost:8000
```

Swagger:

```text
http://localhost:8000/docs
```

## Docker

Start PostgreSQL and Redis:

```bash
docker compose up -d
```

Check:

```bash
docker compose ps
```

Logs:

```bash
docker compose logs -f
```

Stop:

```bash
docker compose down
```

Rebuild:

```bash
docker compose up -d --build
```

## Quick Start

```bash
# Start infrastructure
docker compose up -d

# Backend
cd backend
venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:3000
```

## Application Screenshots

<img width="2880" height="3520" alt="localhost_3000_main" src="https://github.com/user-attachments/assets/58bd980a-e3e1-4d80-b791-eb152ac77009" />
<img width="2880" height="3334" alt="localhost_3000_ (3)ab" src="https://github.com/user-attachments/assets/066c100c-3a23-429a-b5b6-3a0f8ec50ca3" />
<img width="2880" height="2272" alt="localhost_3000_fd" src="https://github.com/user-attachments/assets/2fd73803-1306-4106-8d4f-aecf60d41209" />
<img width="2880" height="1696" alt="localhost_3000_signin (1)" src="https://github.com/user-attachments/assets/dcaf9c83-1f84-4b2f-93ac-75ec5131559d" />
<img width="2880" height="1296" alt="localhost_3000_registration-success" src="https://github.com/user-attachments/assets/63307812-41b0-4915-bb42-f687bd92aa79" />
<img width="2880" height="1296" alt="localhost_3000_signin" src="https://github.com/user-attachments/assets/ab4591ed-193a-4582-9afa-f6a6126eeb4e" />
<img width="2880" height="1296" alt="localhost_3000_forgot-password" src="https://github.com/user-attachments/assets/b4cd9309-4d0f-4e59-ad0c-8b9582f36784" />
<img width="2880" height="1296" alt="localhost_3000_verify-otp" src="https://github.com/user-attachments/assets/aef94e08-c836-4fc7-ad49-c95e2534d0be" />
<img width="2880" height="1296" alt="localhost_3000_update-password" src="https://github.com/user-attachments/assets/85fca441-c493-4556-b25d-d4a9a1a0ba04" />
<img width="2880" height="1296" alt="localhost_3000_password-reset-success" src="https://github.com/user-attachments/assets/ff0a57b9-03b0-4b71-93a3-40ed8f0efc68" />
<img width="2880" height="1296" alt="localhost_3000_document-chat" src="https://github.com/user-attachments/assets/028cae36-69ca-4cd1-9e35-310884e58561" />
<img width="2880" height="1296" alt="localhost_3000_ uploaddoc" src="https://github.com/user-attachments/assets/3cc79927-6ded-4ac9-9c75-19c0c4fe67ac" />
<img width="2880" height="1962" alt="localhost_3000_ (3)chats" src="https://github.com/user-attachments/assets/9f9987b4-b0db-4d07-8fd5-2e398e866e72" />
<img width="2880" height="1296" alt="localhost_3000_comparison" src="https://github.com/user-attachments/assets/3115d77e-e504-405d-a63c-c9071cb4966d" />
<img width="2880" height="5318" alt="localhost_3000_ (3)comparsion" src="https://github.com/user-attachments/assets/78792129-b16f-45d8-8fb1-eb8c2d404c8c" />
<img width="2880" height="1296" alt="localhost_3000_report-analysis (1)aaa" src="https://github.com/user-attachments/assets/3b1e40f0-cdd1-468d-86a2-ada2715a1125" />
<img width="2880" height="7984" alt="localhost_3000_ (3)allreports" src="https://github.com/user-attachments/assets/cd3a67ff-fbed-4441-868a-2e15c8ac9d6d" />
<img width="2880" height="1296" alt="localhost_3000_ (3)profile" src="https://github.com/user-attachments/assets/613587b6-0d47-4eed-8a4a-bd3380f1f24c" />
<img width="2880" height="1296" alt="localhost_3000_delete-profile-success" src="https://github.com/user-attachments/assets/6c0143de-0912-45aa-9c0e-8442d4d4ebc6" />









