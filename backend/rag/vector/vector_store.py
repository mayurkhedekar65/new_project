import os
from dotenv import load_dotenv
from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")


# creates embeddings from chunks
def create_or_get_vector_db():
    embedding_model = GoogleGenerativeAIEmbeddings(
        model="gemini-embedding-001",
        output_dimensionality=3072)
    vector_store = Chroma(
        embedding_function=embedding_model,
        persist_directory='new_chroma_db',
        collection_name='sample')

    return vector_store
