import os
from pydantic_settings import BaseSettings

# BaseSettings validates that variables exist at startup
class Settings(BaseSettings):
    # Infrastructure
    REDIS_URL: str
    SUPABASE_URL: str
    SUPABASE_KEY: str

    # AI GOOGLE - (Embedings)
    GOOGLE_API_KEY: str
    # AI - OpenRouter (Chat)
    OPENROUTER_API_KEY: str
    OPENROUTER_BASE_URL: str
    OPENROUTER_MODEL: str

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()        
