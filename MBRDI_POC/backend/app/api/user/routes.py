from datetime import timedelta
from typing import List
from app.core import security
from app.core.config import settings
from app.database.base import get_db
from app.utils.messages import Message
from app.utils.deps import get_current_user, ADMIN_ONLY_RESOURCES,USER_ONLY_RESOURCES,ADMIN_OR_OWNER_RESOURCES
from fastapi import APIRouter, Depends, HTTPException, status , UploadFile,File,Query
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from . import crud, schemas
import pandas as pd
from fastapi.responses import FileResponse
from app.api.user.schemas import User
from pathlib import Path
import os
import sys
import signal
# Create API Router Instance
router = APIRouter()

# Get current user
@router.get("/me", response_model=schemas.User)
async def read_users_me(current_user: schemas.User = Depends(get_current_user)):
    return current_user

@router.get("/delete/users", response_model=List[schemas.User],dependencies=[Depends(get_current_user), Depends(ADMIN_OR_OWNER_RESOURCES)])
async def read_users( db: Session = Depends(get_db)):
    users = crud.get_delete_users(db)
    return users


# Get all user
@router.get("/logs", response_model=List[schemas.User],dependencies=[Depends(get_current_user), Depends(ADMIN_OR_OWNER_RESOURCES)])
async def read_users( db: Session = Depends(get_db)):
    users = crud.get_log_users(db)
    return users


@router.get("/", response_model=List[schemas.User],dependencies=[Depends(get_current_user), Depends(ADMIN_OR_OWNER_RESOURCES)])
async def read_users( db: Session = Depends(get_db)):
    users = crud.get_users(db)
    return users


# Get Specific user
@router.get("/{user_id}", response_model=schemas.User,dependencies=[Depends(get_current_user), Depends(ADMIN_OR_OWNER_RESOURCES)])
async def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail=Message.USER_NOT_FOUND)
    return db_user
@router.post("/", response_model=schemas.User, status_code=status.HTTP_201_CREATED) #,dependencies=[Depends(get_current_user), Depends(ADMIN_ONLY_RESOURCES)]
async def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user email already exists
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=Message.USER_EXISTS)

    try:
        created_user = crud.create_user(db=db, user=user)
    except ValueError as e:
        if str(e) == "Role not found":
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=Message.ROLE_NOT_FOUND)
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    return created_user





@router.put("/{user_id}", response_model=schemas.User, dependencies=[Depends(get_current_user), Depends(ADMIN_ONLY_RESOURCES)])
async def update_user(user_id: int, user: schemas.UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    username = current_user.first_name
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail=Message.USER_NOT_FOUND)
    return crud.update_user(db=db, user_id=user_id, user=user, username=username)

@router.put("/is_neglated/{user_id}", response_model=schemas.User, dependencies=[Depends(get_current_user), Depends(ADMIN_ONLY_RESOURCES)])
async def update_user_is_neglated(user_id: int, user: schemas.UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    username = current_user.first_name
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail=Message.USER_NOT_FOUND)
    return crud.update_user_is_neglated(db=db, user_id=user_id, user=user, username=username)

@router.put("/{user_id}/password", response_model=dict)
async def update_user_password(user_id: int, user: schemas.UserPassword, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    username = current_user.first_name
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail=Message.USER_NOT_FOUND)

    # Check if password and confirm_password match
    if user.password != user.confirm_password:
        raise HTTPException(status_code=400, detail="Password and Confirm Password do not match")

    crud.update_password(db=db, user_id=user_id, user=user, username=username)
    return {"message": "Updated successfully"}





# Delete user
@router.delete("/{user_id}", dependencies=[Depends(get_current_user), Depends(ADMIN_ONLY_RESOURCES)])
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail=Message.USER_NOT_FOUND)
    crud.delete_user(db=db, user_id=user_id)

    response = {
        "status": True,
        "message": Message.USER_DELETED
    }

    return response

@router.post("/login", response_model=schemas.Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=Message.INVALID_CREDENTIALS)
    
    return {
        "access_token": security.create_access_token(user.id),
        "token_type": "bearer",
        "expire_in": timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
        "refresh_token": security.create_refresh_token(user.id),
        "role" : user.role,
    }

@router.post("/logout")
async def logout(current_user: schemas.User = Depends(get_current_user)):
    return {"message": "Logout Successful"}



@router.post("/upload", response_model=List[schemas.User])
async def upload_users(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Determine the file type and read the file accordingly
    if file.filename.endswith('.csv'):
        df = pd.read_csv(file.file)
    elif file.filename.endswith(('.xls', '.xlsx')):
        df = pd.read_excel(file.file)
    else:
        raise HTTPException(status_code=400, detail="File must be a CSV or Excel")

    # Define the required columns
    required_columns = [
        'email', 'first_name', 'last_name', 'dept', 'emp_id',
        'mobile', 'dob', 'doj', 'gender', 'role', 'position', 'password'
    ]
    
    # Ensure all required columns are in the dataframe
    missing_columns = [col for col in required_columns if col not in df.columns]
    if missing_columns:
        raise HTTPException(status_code=400, detail=f"Missing columns: {', '.join(missing_columns)}")

    # Convert date columns to the expected format
    df['dob'] = pd.to_datetime(df['dob'], errors='coerce').dt.strftime('%Y-%m-%d')
    df['doj'] = pd.to_datetime(df['doj'], errors='coerce').dt.strftime('%Y-%m-%d')

    users = []
    for _, row in df.iterrows():
        try:
            user = schemas.UserCreate(
                email=row['email'],
                first_name=row.get('first_name', ''),
                last_name=row.get('last_name', ''),
                dept=row.get('dept', ''),
                emp_id=row.get('emp_id', ''),
                mobile=row.get('mobile', ''),
                dob=row.get('dob', ''),
                doj=row.get('doj', ''),
                gender=row.get('gender', ''),
                role=row.get('role', ''),
                position=row.get('position', ''),
                password=row.get('password')
            )
            users.append(user)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=f"Invalid data: {str(e)}")

    created_users = []
    for user in users:
        try:
            # Pass the current user's first name for created_by
            db_user = crud.create_user(db=db, user=user)
            db.commit()
            db.refresh(db_user)
            created_users.append(db_user)
        except IntegrityError as e:
            db.rollback()
            error_message = str(e.orig)
            raise HTTPException(status_code=400, detail=error_message)

    return created_users



@router.get("/dept/count", response_model=dict)#,dependencies=[Depends(get_current_user), Depends(ADMIN_OR_OWNER_RESOURCES)])
def get_asset_category_count( db: Session = Depends(get_db)):
    try:
        count = crud.get_dept(db)
        return count
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




@router.get("/position/count", response_model=dict)#,dependencies=[Depends(get_current_user), Depends(ADMIN_OR_OWNER_RESOURCES)])
def get_asset_category_count( db: Session = Depends(get_db)):
    try:
        count = crud.get_positions(db)
        return count
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.get("/dept-position/count", response_model=dict)#,dependencies=[Depends(get_current_user), Depends(ADMIN_OR_OWNER_RESOURCES)])
def get_asset_category_count( db: Session = Depends(get_db)):
    try:
        count = crud.get_positions_count_by_dept_fixed(db)
        return count
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


from tempfile import NamedTemporaryFile
import os
from datetime import datetime
from typing import Optional

@router.get("/download/users/custom")
def download_custom_user_csv(
    start_date: Optional[str] = Query(None, description="Start date for filtering", example="01-03-2024", regex=r"\d{2}-\d{2}-\d{4}"),
    end_date: Optional[str] = Query(None, description="End date for filtering", example="15-03-2024", regex=r"\d{2}-\d{2}-\d{4}"),
    dept: Optional[List[str]] = Query(["all"], description="Department(s) to filter by", example=["Admin", "HR"]),
    db: Session = Depends(get_db)
):
    # Validate departments
    valid_depts = ["Admin", "AUTOCAD", "AV", "Finance", "HR", "IBMS", "IOT", "IT IT", "Marketing", "Office Help", "Operations", "Presales", "Projects", "Sales", "UX/UI"]
    if not all(d in valid_depts or d == "all" for d in dept):
        raise HTTPException(status_code=400, detail="Invalid department(s)")

    # Parse start_date and end_date if provided
    if start_date:
        try:
            start_date = datetime.strptime(start_date, "%d-%m-%Y").date()
        except ValueError:
            raise HTTPException(status_code=422, detail="Invalid start_date. Please provide a valid date in the format DD-MM-YYYY.")
    if end_date:
        try:
            end_date = datetime.strptime(end_date, "%d-%m-%Y").date()
        except ValueError:
            raise HTTPException(status_code=422, detail="Invalid end_date. Please provide a valid date in the format DD-MM-YYYY.")

    # Fetch data from the database and convert to DataFrame
    df = crud.fetch_user_details_custom_time(db, start_date=start_date, end_date=end_date, dept_list=dept)

    # Write DataFrame to CSV file
    with NamedTemporaryFile(delete=False, suffix='.csv') as temp_file:
        df.to_csv(temp_file.name, index=False)

    # Return CSV file for download
    if os.path.exists(temp_file.name):
        return FileResponse(
            temp_file.name, 
            filename="users_data.csv", 
            media_type="text/csv", 
            headers={"Content-Disposition": "attachment; filename=users_data.csv"}
        )
    else:
        raise HTTPException(status_code=404, detail="CSV file not found")




@router.get("/download/users/logs/custom")
def download_custom_user_csv(
    start_date: Optional[str] = Query(None, description="Start date for filtering", example="01-08-2024", regex=r"\d{2}-\d{2}-\d{4}"),
    end_date: Optional[str] = Query(None, description="End date for filtering", example="25-08-2024", regex=r"\d{2}-\d{2}-\d{4}"),
    
    db: Session = Depends(get_db)):
   
    if start_date:
        try:
            start_date = datetime.strptime(start_date, "%d-%m-%Y").date()
        except ValueError:
            raise HTTPException(status_code=422, detail="Invalid start_date. Please provide a valid date in the format DD-MM-YYYY.")
    if end_date:
        try:
            end_date = datetime.strptime(end_date, "%d-%m-%Y").date()
        except ValueError:
            raise HTTPException(status_code=422, detail="Invalid end_date. Please provide a valid date in the format DD-MM-YYYY.")

    # Fetch data from the database and convert to DataFrame
    df = crud.fetch_user_logs_custom_time(db, start_date=start_date, end_date=end_date)

    # Write DataFrame to CSV file
    with NamedTemporaryFile(delete=False, suffix='.csv') as temp_file:
        df.to_csv(temp_file.name, index=False)

    # Return CSV file for download
    if os.path.exists(temp_file.name):
        return FileResponse(
            temp_file.name, 
            filename="users_data.csv", 
            media_type="text/csv", 
            headers={"Content-Disposition": "attachment; filename=users_logs_data.csv"}
        )
    else:
        raise HTTPException(status_code=404, detail="CSV file not found")






