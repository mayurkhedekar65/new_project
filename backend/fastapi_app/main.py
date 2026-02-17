from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from langchain_groq import ChatGroq
import json
from dotenv import load_dotenv
import os
from prompt.system_prompt import llm_prompt
from schemas.requestSchema import TextRequest

# creates an app
app = FastAPI()

# allowed origins
origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://127.0.0.1:8000/"
]

# middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# loads the api key
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# generates quiz & returns a json response
@app.get("/generate_quiz")
async def generate_quiz(request: TextRequest):
    os.environ["GROQ_API_KEY"] = GROQ_API_KEY
    user_input_text = request.text
    questions_count= request.num_of_questions
  
    # model initialize
    llm_model = ChatGroq(
        model="qwen/qwen3-32b",
        temperature=0,
        max_tokens=None,
        reasoning_format="parsed",
        timeout=None,
        max_retries=2,

    )
    
    # llm model request & response prompt
    messages = [
        (
            "system",
            llm_prompt
        ),
        ("human",
         f"""
        {user_input_text} 
        Generate {questions_count} MCQs from the above paragraph. 
        Give the response in a dictionary format with key-value pairs. 
        Provide options as option 1, option 2, etc., and 
        give the correct_answer as the value, not as an option. 
        Do not use '1', '2' as keys; instead, return directly an array.
        """),
    ]

    llm_model_response = llm_model.invoke(messages)
    json_data_file = json.loads(llm_model_response.content)
    return {"generated_quiz": json_data_file}
