import os
from pydantic import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    """
    Application settings from environment variables with defaults
    """
    # Database configuration
    MONGODB_URL: str
    MONGODB_DB_NAME: str
    
    # Security configuration
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Email configuration
    SMTP_USER: str
    SMTP_PASSWORD: str
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 465
    
    # Application configuration
    FRONTEND_URL: str = "http://localhost:5173"
    
    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'
        case_sensitive = True

# Load settings
try:
    settings = Settings()
    
    # Validate required settings
    required_settings = [
        "MONGODB_URL", "MONGODB_DB_NAME", 
        "SECRET_KEY", "SMTP_USER", "SMTP_PASSWORD"
    ]
    
    missing_settings = [setting for setting in required_settings if not getattr(settings, setting, None)]
    
    if missing_settings:
        raise ValueError(f"Missing required environment variables: {', '.join(missing_settings)}")
        
except Exception as e:
    raise ValueError(f"Configuration error: {str(e)}") from e