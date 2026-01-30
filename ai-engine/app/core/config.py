import os
from pydantic_settings import BaseSettings

# BaseSettings validates that variables exist at startup
class Settings(BaseSettings):
    REDIS_URL: str
    OPENAI_API_KEY: str
    SUPABASE_URL: str
    SUPABASE_KEY: str

    class Config:
        env_file = ".env"

settings = Settings()        
