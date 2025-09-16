from datetime import datetime
from sqlalchemy import Column, DateTime, String, Integer, ForeignKey,Date
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.mysql import TINYINT

from app.database.base import Base, BaseModel

class UserModel(Base, BaseModel):

    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(100), unique=True, index=True)
    first_name = Column(String(255))
    last_name = Column(String(255))
    password = Column(String(1024))
    dept = Column(String(255))
    emp_id = Column(String(255))
    mobile = Column(String(20))
    dob  = Column(String(20))
    doj = Column(String(20))
    gender = Column(String(255))
    role = Column(String(255))
    position = Column(String(255))
    is_active = Column(TINYINT, default=True)
    is_neglated = Column(TINYINT, default=False)
    created_by = Column(String(100), nullable=True)
    modified_by = Column(String(100), nullable=True)

    
    

    def __repr__(self):
        return f"<User (id={self.id}, email={self.email}, is_active={self.is_active})>"
    


class UserLogModel(Base, BaseModel):

    __tablename__ = "user_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(100))
    first_name = Column(String(255))
    last_name = Column(String(255))
    password = Column(String(1024))
    dept = Column(String(255))
    emp_id = Column(String(255))
    mobile = Column(String(20))
    dob  = Column(String(20))
    doj = Column(String(20))
    gender = Column(String(255))
    role = Column(String(255))
    position = Column(String(255))
    is_active = Column(TINYINT, default=True)
    is_neglated = Column(TINYINT, default=False)
    created_by = Column(String(100), nullable=True)
    modified_by = Column(String(100), nullable=True)

    

    def __repr__(self):
        return f"<User (id={self.id}, email={self.email}, is_active={self.is_active})>"
