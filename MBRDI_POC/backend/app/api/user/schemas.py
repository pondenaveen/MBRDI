import datetime 
from pydantic import BaseModel, EmailStr ,Field
from typing import Optional
from datetime import date



class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    dept : str
    emp_id : str
    mobile : str
    dob : str
    doj : str
    gender : str
    position: Optional[str] = None
    #is_active: bool = True
    


class UserCreate(UserBase):
    role: str
    password: str


class UserUpdate(BaseModel):
    email: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    dept : Optional[str] = None
    emp_id : Optional[str] = None
    mobile : Optional[str] = None
    dob : Optional[str] = None
    doj : Optional[str] = None
    role: Optional[str] = None
    gender : Optional[str] = None
    position : Optional[str] = None
    #is_active: Optional[bool] = None
   

class UserPassword(BaseModel):
    password: str
    confirm_password : str

class UserDelete(BaseModel):
    is_neglated : bool = False

class User(UserBase):
    id: int
    role: str
    created_by :  Optional[str] = None
    modified_by :  Optional[str] = None
    created_at: datetime.datetime= datetime.datetime.now()
    modified_at: datetime.datetime = datetime.datetime.now()
    

    class Config:
        orm_mode = True


# Token Schema
class Token(BaseModel):
    access_token: str
    token_type: str
    expire_in: datetime.timedelta
    refresh_token: str
    role : str

class TokenData(BaseModel):
    username: Optional[str] = None


class TokenPayload(BaseModel):
    sub: Optional[str] = None
    exp: Optional[str] = None