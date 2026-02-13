import os
import logging
from pathlib import Path
from typing import List, Optional

# External Clients
from supabase import create_client, Client
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import SupabaseVectorStore
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

# Internal Modules
from app.models.rag_schemas import FileProcessingRequest
from app.core.config import settings

logger = logging.getLogger(__name__)

class RAGService:
    """
    Service responsible for the RAG (Retrieval,Augmented Generation) pipeline. Handles document ingestion (PDF to Vectors) and query resolution (Chat).
    """

    def __init__(self):

        # Initialize Supabase Client
        self.supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_key)

        #Initialize Embedding Model (Google Gemini text-embbeding-004) FREE
        #Output diomension: 768
        logger.info("Initializing Embeddings with Google Gemini...")
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="models/text-embedding-004",
            google_api_key=settings.GOOGLE_API_KEY
        )

        # Initialize LLM via OpenRouter FREE
        logger.info(f"Initializing LLM with OpenRouter")
        self.llm = ChatOpenAI(
            base_url=settings.OPENROUTER_BASE_URL,
            api_key=settings.OPENROUTER_API_KEY,
            model=settings.OPENROUTER_MODEL,
            temperature=0.3, #Low temperature for factual consistency
        )

        #Vector Store configuration
        self._table_name = "documents"
        self.query_name = "match_documents"

        #private
        def _get_vector_store(self) -> SupabaseVectorStore:
            """ Returns a configured SupabaseVectorStore instance."""
            return SupabaseVectorStore(
                client=self.supabase,
                embedding=self.embeddings,
                table_name=self._table_name,
                query_name=self._query_name
            )
        
        async def process_file(self, data: FileProcessingRequest) -> bool:
            """
            Orchestrates the ingestion process: Download -> Load -> Split -> Embed -> Store
            
            Args: data: Contains fileId and userId.

            Returns: bool: True if succesful, raises Exception otherwise.
            """

            try:
                logger.info(f"[Ingestion] Processing File {data.fileId} for user {data.userId}")

                 # 1. Download PDF from Supabase Storage (bucket: 'pdfs)
                try:
                    file_bytes = self.supabase.storage.from_("pdfs").download(f"{data.userId}/{data.fileId}.pdf")
                    temp

            
            
            except Exception as e:

