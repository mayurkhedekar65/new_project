# Quizize.ai - AI-Powered Quiz Generation Platform

An intelligent application that uses AI to automatically generate multiple-choice quizzes from text, PDFs, and documents. Built with a modern full-stack architecture using React, Django, FastAPI, and LangChain.

## Features

- **AI-Powered Quiz Generation**: Automatically create quizzes from any text input, PDF, or document
- **Instant Quiz Creation**: Generate multiple-choice questions in seconds with a single click
- **User Authentication**: Secure sign-up, login, and password recovery
- **File Support**: Extract text from PDFs, documents, and other file formats
- **Customizable Questions**: Specify the number of questions you want generated
- **Responsive UI**: Modern interface built with React and Tailwind CSS
- **Email Notifications**: Feedback form with email integration

## Architecture

### Tech Stack

**Frontend:**

- React
- Tailwind CSS
- Framer Motion for animations
- FontAwesome icons

**Backend:**

- Django with Django REST Framework
- FastAPI for LLM operations
- LangChain with Groq AI integration
- PostgreSQL database
- JWT authentication

**AI/ML:**

- Groq LLM (Qwen 3-32B model)
- LangChain for prompt management
- MarkItDown for document parsing

## Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/Abhiraj05/Quizize.ai-AI-Powered-Quiz-Generation-Platform.git
cd new_project
```

#### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on http://localhost:5173

#### 3. Backend Setup - Django

```bash
cd backend/django_app
pip install -r requirements.txt

# Run migrations
python manage.py makemigration
python manage.py migrate

# Start Django server
python manage.py runserver
```

Django runs on http://127.0.0.1:8000

#### 4. Backend Setup - FastAPI

```bash
cd backend/fastapi_app

# Create .env file
echo "GROQ_API_KEY=your_groq_api_key_here" > .env

pip install -r requirements.txt

# Start FastAPI server
fastapi dev main.py --port 8001
```

FastAPI runs on http://127.0.0.1:8001

#### 5. Configuration

Environment Variables
`Inside settings.py `
#### Django

```bash

NAME: your_database_name,  # database name
USER: your_db_user,   # username
PASSWORD: your_db_password, # password
HOST: localhost,  # host

EMAIL_HOST_USER=your_email
EMAIL_HOST_PASSWORD=your_email_password
```

#### FastAPI

`Create .env file in backend/fastapi_app/`

```bash
GROQ_API_KEY=your_groq_api_key
```
