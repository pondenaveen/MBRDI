# Filename: config.py
import os

from dotenv import load_dotenv
from pydantic import BaseSettings
from typing import Optional
# Load environment variables from .env file
load_dotenv()

# Get environment variables
DATABASE_URL = os.getenv("DATABASE_URL")

#Settings
class Settings(BaseSettings):
    
    ACCESS_TOKEN_EXPIRE_MINUTES = 60 
    REFERSH_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 7 days
    ALGORITHM = "HS256"
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    JWT_REFRESH_SECRET_KEY = os.getenv("JWT_REFRESH_SECRET_KEY")

settings = Settings()

