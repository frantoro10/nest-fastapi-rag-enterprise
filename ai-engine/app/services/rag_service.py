import os
import logging
from pathlib import Path
from typing import List, Optional

# External Clients 
from supabase import create_client, Client
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

# Internal lModules
from app.models.rag_schemas import FileProcessingRequest

logger = logging.getLogger(__name__)

class RAGService:

    async def process_file(self, data: FileProcessingRequest):
        """
        Orchestrate the entire RAG workflow:
        1. Download PDF from Supabase
        2. Clean and fragment text
        3. Generate embeds (OpenAI)
        4. Save to Vector Store (Supabase pgvector)
        """


