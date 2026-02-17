# Quizize.ai - AI-Powered Quiz Generation Platform

An intelligent application that uses AI to automatically generate multiple-choice quizzes from text, PDFs, and documents. Built with a modern full-stack architecture using React, Django, FastAPI, and LangChain.

## Features

- **AI-Powered Quiz Generation**: Automatically create quizzes from any text input, PDF, or document
- **Instant Quiz Creation**: Generate multiple-choice questions in seconds with a single click
- **User Authentication**: Secure sign-up, login, and password recovery
- **File Support**: Extract text from PDFs, documents, and other file formats
- **Customizable Questions**: Specify the number of questions you want generated
- **Responsive UI**: Modern interface built with React and Tailwind CSS


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

# create environment
python -m venv env

# Windows
env\Scripts\activate

# macOS / Linux
source env/bin/activate
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

# create environment
python -m venv env

# Windows
env\Scripts\activate

# macOS / Linux
source env/bin/activate

# Create .env file
echo "GROQ_API_KEY=your_groq_api_key_here" > .env

pip install -r requirements.txt

# Start FastAPI server
fastapi dev main.py --port 8001
```

FastAPI runs on http://127.0.0.1:8001

#### 5. Configuration

Environment Variables
#### Django

`Inside settings.py `

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

## Screenshots
### Main Page
<img width="1920" height="1261" alt="screencapture-localhost-5173-2026-02-13-13_48_56" src="https://github.com/user-attachments/assets/099da47c-b2f3-4afa-b1f7-8064f1cae0f6" />

### SignIn & SignUp Pages
<img width="1920" height="868" alt="screencapture-localhost-5174-signup-2026-02-16-18_08_20" src="https://github.com/user-attachments/assets/d8ec5afa-903d-4984-bc90-b2ecbeaf9489" />
<img width="1920" height="868" alt="screencapture-localhost-5174-signin-2026-02-16-18_08_06" src="https://github.com/user-attachments/assets/7b2d696d-2c43-473d-934e-1c43233fbc2b" />

### Generate Quiz Page
<img width="1920" height="1093" alt="screencapture-localhost-5173-generatequiz-2026-02-16-18_32_45" src="https://github.com/user-attachments/assets/eee6e3d7-02d0-480e-a288-b683fd41b72e" />

### Contact Page 
<img width="1920" height="1288" alt="screencapture-localhost-5173-contact-2026-02-16-18_36_07" src="https://github.com/user-attachments/assets/75142a02-ead3-40a6-9316-ba88c531f4cf" />

### About Page
<img width="1920" height="1205" alt="screencapture-localhost-5173-about-2026-02-16-18_36_38" src="https://github.com/user-attachments/assets/b18d2015-19c7-4d4b-a101-76ae0eafe025" />

### Reset & Set New Password Pages
<img width="1920" height="868" alt="screencapture-localhost-5174-forgotpassword-2026-02-16-18_11_35" src="https://github.com/user-attachments/assets/f1492c8e-a4e3-485c-bfa2-79d9d7569046" />
<img width="1920" height="868" alt="screencapture-localhost-5174-setnewpassword-2026-02-16-18_12_02" src="https://github.com/user-attachments/assets/71d46de2-1e26-4452-a5ed-891c79b6f391" />


