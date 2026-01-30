import logging
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
        
        
