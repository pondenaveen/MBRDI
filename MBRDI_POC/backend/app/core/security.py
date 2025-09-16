from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from app.core.config import settings

# Password Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Hash a password
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def email_lowercase(email: str) -> str:
    return email.lower()

def asset_type_lower(asset_type: str) -> str:
    return asset_type.lower()

# Verify a password
def verify_password(password: str, hashed_password: str) -> bool:
    return pwd_context.verify(password, hashed_password)

# Create an access token
def create_access_token(data: int, expires_delta: timedelta = None) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": expire, "sub": str(data)}
    # Encode the JWT
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

# Create a refresh token
def create_refresh_token(data: int, expires_delta: timedelta = None) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.REFERSH_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": expire, "sub": str(data)}
    # Encode the JWT
    encoded_jwt = jwt.encode(to_encode, settings.JWT_REFRESH_SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt