from langchain_text_splitters import RecursiveCharacterTextSplitter


# creates chunks from text
def create_chunks(document_text):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=150,
        length_function=len,
        separators=["\n\n", "\n", ". ", " ", ""]

    )
    documents = text_splitter.create_documents([document_text])

    return documents
