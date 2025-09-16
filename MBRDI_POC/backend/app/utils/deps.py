from datetime import datetime
from typing import List

from app.api.user.crud import get_user
from app.api.user.schemas import TokenPayload, User
from app.core.config import settings
from app.database.base import get_db
from app.utils.messages import Message
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import ValidationError
from sqlalchemy.orm import Session

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl="/users/login",
    scheme_name="JWT",
)

async def get_current_user(token: str = Depends(reusable_oauth2), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, 
                            settings.JWT_SECRET_KEY, 
                            algorithms=[settings.ALGORITHM])
        token_data = TokenPayload(**payload)
        if datetime.fromtimestamp(int(token_data.exp)) < datetime.now():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired",
                headers={"WWW-Authenticate": "Bearer"})
    except (JWTError, ValidationError) as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    user =  get_user(db, token_data.sub)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user 


class RoleChecker:
    def __init__(self, allowed_roles: List):
        self.allowed_roles = allowed_roles

    def __call__(self, user: User = Depends(get_current_user)):
        if user.role not in self.allowed_roles:
            raise HTTPException(status_code=403, detail=Message.NOT_ENOUGH_PERMISSIONS)

# RBAC
ADMIN_ONLY_RESOURCES = RoleChecker(["Admin"])   
USER_ONLY_RESOURCES = RoleChecker(["User"])
ADMIN_OR_OWNER_RESOURCES = RoleChecker(["Admin", "User"])