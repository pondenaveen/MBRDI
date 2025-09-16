from sqlalchemy.orm import Session
from sqlalchemy import update
from fastapi import HTTPException, status
from app.core.security import hash_password, verify_password,email_lowercase 
from .models import UserModel,UserLogModel
from .schemas import UserUpdate, UserCreate,UserPassword
from sqlalchemy.exc import SQLAlchemyError
import datetime
import pandas as pd
from typing import List

# Get all the Users
def get_users(db: Session):
    return db.query(UserModel).filter(UserModel.is_neglated == 0).all()

def get_delete_users(db: Session):
    return db.query(UserModel).filter(UserModel.is_neglated == 1).all()

def get_log_users(db: Session):
    return db.query(UserLogModel).all()


# Get a single user
def get_user(db: Session, user_id: int):
    return db.query(UserModel).get(user_id)


# Get a single user by email %s
def get_user_by_email(db: Session, email: str):
    return db.query(UserModel).filter(UserModel.email.contains(email)).first()


# Authenticate User
def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user


# Create a new user
def create_user(db: Session, user: UserCreate):
    

    hashed_password = hash_password(user.password)
    user_data = user.dict()
    user_data["password"] = hashed_password

    new_user = UserModel(**user_data)
    new_log_user =UserLogModel(**user_data)
    db.add(new_user)
    db.add(new_log_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def update_user(db: Session, user_id: int, user: UserUpdate, username: str):
    try:
        # Query the existing user
        existing_user_query = db.query(UserModel).filter(UserModel.id == user_id)
        existing_user = existing_user_query.first()
        
        if not existing_user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with id {user_id} not found")
        
        # Update the user details
        updated_data = user.dict()
        updated_data["modified_by"] = username  # Add modified_by to the updated data
        existing_user_query.update(updated_data, synchronize_session=False)
        
        # Prepare data for the log entry
        log_data = {
            "email": updated_data.get("email", existing_user.email),
            "first_name": updated_data.get("first_name", existing_user.first_name),
            "last_name": updated_data.get("last_name", existing_user.last_name),
            "password": updated_data.get("password", existing_user.password),
            "dept": updated_data.get("dept", existing_user.dept),
            "emp_id": updated_data.get("emp_id", existing_user.emp_id),
            "mobile": updated_data.get("mobile", existing_user.mobile),
            "dob": updated_data.get("dob", existing_user.dob),
            "doj": updated_data.get("doj", existing_user.doj),
            "gender": updated_data.get("gender", existing_user.gender),
            "role": updated_data.get("role", existing_user.role),
            "position": updated_data.get("position", existing_user.position),
            "is_active": updated_data.get("is_active", existing_user.is_active),
            "is_neglated": existing_user.is_neglated,
            "created_by": existing_user.created_by,
            "modified_by": username,
            "created_at": existing_user.created_at,  # Maintain original timestamps
            "modified_at": datetime.datetime.now()
        }
        
        # Create a new log entry
        new_log_entry = UserLogModel(**log_data)
        db.add(new_log_entry)
        
        # Commit the transaction
        db.commit()
        
        # Refresh the updated user to reflect the latest state
        db.refresh(existing_user)
        
        return existing_user
    
    except SQLAlchemyError as e:
        # Rollback the transaction if an error occurs
        db.rollback()
        raise e

def update_user_is_neglated(db: Session, user_id: int, user: UserUpdate, username: str):
    try:
        # Query the existing user
        existing_user_query = db.query(UserModel).filter(UserModel.id == user_id)
        existing_user = existing_user_query.first()
        
        if not existing_user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with id {user_id} not found")
        
        # Update the user details
        updated_data = {"is_neglated": user.is_neglated}
        updated_data["modified_by"] = username
        existing_user_query.update(updated_data, synchronize_session=False)
        
        # Prepare data for the log entry
        log_data = {
            "email": existing_user.email,
            "first_name": existing_user.first_name,
            "last_name": existing_user.last_name,
            "password": existing_user.password,
            "dept": existing_user.dept,
            "emp_id": existing_user.emp_id,
            "mobile": existing_user.mobile,
            "dob": existing_user.dob,
            "doj": existing_user.doj,
            "gender": existing_user.gender,
            "role": existing_user.role,
            "position": existing_user.position,
            "is_active": existing_user.is_active,
            "is_neglated": updated_data["is_neglated"],
            "created_by": existing_user.created_by,
            "modified_by": username,
            "created_at": existing_user.created_at,
            "modified_at": datetime.datetime.now()
        }
        
        # Create a new log entry
        new_log_entry = UserLogModel(**log_data)
        db.add(new_log_entry)
        
        # Commit the transaction
        db.commit()
        
        # Refresh the updated user to reflect the latest state
        db.refresh(existing_user)
        
        return existing_user
    
    except SQLAlchemyError as e:
        # Rollback the transaction if an error occurs
        db.rollback()
        raise e


def update_password(db: Session, user_id: int, user: UserPassword,username: str):
    try:
        # Retrieve the existing user
        existing_user = db.query(UserModel).filter(UserModel.id == user_id).first()
        
        if not existing_user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with id {user_id} not found")

        # Validate password and confirm_password match
        if user.password != user.confirm_password:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Password and Confirm Password do not match")

        # Hash the new password
        hashed_password = hash_password(user.password)

        # Update the user's password
        existing_user.password = hashed_password
        
        # Create a log entry for the password update
        log_data = {
            "email": existing_user.email,
            "first_name": existing_user.first_name,
            "last_name": existing_user.last_name,
            "password": hashed_password,  # Store the new hashed password in the log
            "dept": existing_user.dept,
            "emp_id": existing_user.emp_id,
            "mobile": existing_user.mobile,
            "dob": existing_user.dob,
            "doj": existing_user.doj,
            "gender": existing_user.gender,
            "role": existing_user.role,
            "is_active": existing_user.is_active,
            "is_neglated": existing_user.is_neglated,
            "created_by" : existing_user.created_by,
            "modified_by" : username,
            "created_at": datetime.datetime.now(),
            "modified_at": datetime.datetime.now()
            }
        
        new_log_entry = UserLogModel(**log_data)
        db.add(new_log_entry)

        # Commit the transaction
        db.commit()
        
        # Refresh the updated user to reflect the latest state
        db.refresh(existing_user)
        
        return existing_user
    
    except SQLAlchemyError as e:
        # Rollback the transaction if an error occurs
        db.rollback()
        raise e



# Delete an existing user
def delete_user(db: Session, user_id: int):
    existing_user = db.query(UserModel).filter(UserModel.id == user_id)
    if not existing_user.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"user with id {user_id} not found")
    existing_user.delete(synchronize_session=False)
    db.commit()


def get_dept(db: Session):
    return {
        'Admin': db.query(UserModel).filter(UserModel.dept == "Admin").count(),
        'AUTOCAD': db.query(UserModel).filter(UserModel.dept == "AUTOCAD").count(),
        'AV': db.query(UserModel).filter(UserModel.dept == "AV").count(),
        'Finance': db.query(UserModel).filter(UserModel.dept == "Finance").count(),
        'HR': db.query(UserModel).filter(UserModel.dept == "HR").count(),
        'IBMS': db.query(UserModel).filter(UserModel.dept == "IBMS").count(),
        'IOT': db.query(UserModel).filter(UserModel.dept == "IOT").count(),
        'IT': db.query(UserModel).filter(UserModel.dept == "IT").count(),
        'Marketing': db.query(UserModel).filter(UserModel.dept == "Marketing").count(),
        'Office Help': db.query(UserModel).filter(UserModel.dept == "Office Help").count(),
        'Operations': db.query(UserModel).filter(UserModel.dept == "Operations").count(),
        'Presales': db.query(UserModel).filter(UserModel.dept == "Presales").count(),
        'Projects': db.query(UserModel).filter(UserModel.dept == "Projects").count(),
        'Sales': db.query(UserModel).filter(UserModel.dept == "Sales").count(),
        'UX/UI': db.query(UserModel).filter(UserModel.dept == "UX/UI").count(),
    }

def get_positions(db: Session):
    return {
        'Accountant': db.query(UserModel).filter(UserModel.position == "Accountant").count(),
        'Admin': db.query(UserModel).filter(UserModel.position == "Admin").count(),
        'Assistant': db.query(UserModel).filter(UserModel.position == "Assistant").count(),
        'CEO': db.query(UserModel).filter(UserModel.position == "CEO").count(),
        'Designer': db.query(UserModel).filter(UserModel.position == "Designer").count(),
        'Developer': db.query(UserModel).filter(UserModel.position == "Developer").count(),
        'Director': db.query(UserModel).filter(UserModel.position == "Director").count(),
        'Engineer': db.query(UserModel).filter(UserModel.position == "Engineer").count(),
        'Intern': db.query(UserModel).filter(UserModel.position == "Intern").count(),
        'Lead': db.query(UserModel).filter(UserModel.position == "Lead").count(),
        'Manager': db.query(UserModel).filter(UserModel.position == "Manager").count(),
        'Project Manager': db.query(UserModel).filter(UserModel.position == "Project Manager").count(),
        'Senior Developer': db.query(UserModel).filter(UserModel.position == "Senior Developer").count(),
        'Senior Engineer': db.query(UserModel).filter(UserModel.position == "Senior Engineer").count(),
        'Trainee Engineer': db.query(UserModel).filter(UserModel.position == "Trainee Engineer").count(),
    }

from sqlalchemy import func

def get_positions_count_by_dept_fixed(db: Session):
    # Define all possible departments and positions
    departments = [
        "Admin", "AUTOCAD", "AV", "Finance", "HR", "IBMS", 
        "IOT", "IT", "Marketing", "Office Help", "Operations", 
        "Presales", "Projects", "Sales", "UX/UI"
    ]
    
    positions = [
        "Accountant", "Admin", "Assistant", "CEO", "Designer", 
        "Developer", "Director", "Engineer", "Intern", "Lead", 
        "Manager", "Project Manager", "Senior Developer", 
        "Senior Engineer", "Trainee Engineer"
    ]

    # Initialize the result dictionary with all positions set to 0
    positions_count_by_dept = {dept: {pos: 0 for pos in positions} for dept in departments}

    # Query to get the count of positions within each department
    result = db.query(
        UserModel.dept,
        UserModel.position,
        func.count(UserModel.position).label("count")
    ).group_by(UserModel.dept, UserModel.position).all()

    # Fill the counts based on the query result
    for dept, position, count in result:
        if dept in positions_count_by_dept and position in positions_count_by_dept[dept]:
            positions_count_by_dept[dept][position] = count
    
    return positions_count_by_dept



def fetch_user_details_custom_time(db: Session, start_date=None, end_date=None, dept_list: List[str] = None):
    query = db.query(UserModel)
    
    if start_date and end_date:
        query = query.filter(func.date(UserModel.created_at) >= start_date,
                             func.date(UserModel.created_at) <= end_date)
    
    if dept_list and "all" not in dept_list:
        query = query.filter(UserModel.dept.in_(dept_list))
    
    users = query.all()

    data = {
        "email": [user.email for user in users],
        "first_name": [user.first_name for user in users],
        "last_name": [user.last_name for user in users],
        "dept": [user.dept for user in users],
        "emp_id": [user.emp_id for user in users],
        "mobile": [user.mobile for user in users],
        "dob": [user.dob for user in users],
        "doj": [user.doj for user in users],
        "gender": [user.gender for user in users],
        "role": [user.role for user in users],
        "position": [user.position for user in users],
        "modified_by" : [user.modified_by for user in users],
        "created_at": [user.created_at for user in users],
        "modified_at": [user.modified_at for user in users],
    }
    df = pd.DataFrame(data)
    return df


def fetch_user_logs_custom_time(db: Session, start_date=None, end_date=None):
    query = db.query(UserLogModel)
    
    if start_date and end_date:
        query = query.filter(func.date(UserLogModel.created_at) >= start_date,
                             func.date(UserLogModel.created_at) <= end_date)
    
    users = query.all()

    data = {
        "email": [user.email for user in users],
        "first_name": [user.first_name for user in users],
        "last_name": [user.last_name for user in users],
        "dept": [user.dept for user in users],
        "emp_id": [user.emp_id for user in users],
        "mobile": [user.mobile for user in users],
        "dob": [user.dob for user in users],
        "doj": [user.doj for user in users],
        "gender": [user.gender for user in users],
        "role": [user.role for user in users],
        "position": [user.position for user in users],
        "modified_by" : [user.modified_by for user in users],
        "created_at": [user.created_at for user in users],
        "modified_at": [user.modified_at for user in users],
    }
    df = pd.DataFrame(data)
    return df



import os

def get_user_template_path() -> str:
    file_path = os.path.join("app", "static", "templates", "user_template.csv")
    if os.path.exists(file_path):
        return file_path
    else:
        raise FileNotFoundError("User template file not found")