from pydantic import BaseModel, UUID4

class FileProcessingRequest(BaseModel):
    fileId: str #UUID
    userId: str