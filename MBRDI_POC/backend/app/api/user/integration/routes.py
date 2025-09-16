from datetime import timedelta
from typing import List
from app.core import security
from app.core.config import settings
from app.database.base import get_db
from app.utils.messages import Message
from fastapi import APIRouter, Depends, HTTPException,Query
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from . import services
import pandas as pd
from fastapi.responses import FileResponse
from app.api.user.schemas import User
from . import services ,schema
from app.api.config import connect
from pathlib import Path
import os
import sys
import signal
import pandas as pd
from fastapi.responses import FileResponse
from app.api.user.schemas import User
from pathlib import Path
from typing import Optional,Dict,Any,List
from io import StringIO
from datetime import datetime
import pandas as pd
from tempfile import NamedTemporaryFile
import os
import signal
router = APIRouter()




@router.get("/iaq/alert/count", response_model=dict)
def read_total_count(db: Session = Depends(get_db)):
    # Example IAQ data, you can replace it with actual data from the request
    iaq_data = {
        "Temp": 29.69,
        "Hum": 63,
        "CO2": 422,
        "TVOC": 1313,
        "pm10": 28,
        "pm25": 26,
        "AQI": 84,
        "deviceId": "IAQ-1",
        "created_at": "2024-09-25T13:13:23"
    }

    try:
        # Call the my_payloads function with the example data
        latest_data = connect.my_payloads(db, iaq_data)

        print(f"Latest data: {latest_data}")  # Debugging to ensure latest_data is populated

        if latest_data and latest_data["count"] > 0:
            # Return the result from my_payloads (count and alerts)
            return {
                "count": latest_data["count"],
                "alerts": latest_data["alerts"],
                "timestamp": datetime.now()
            }
        else:
            # Raise exception if no alerts were found
            raise HTTPException(status_code=404, detail="No IAQ data found.")
    except Exception as e:
        # Catch and handle any errors during execution
        raise HTTPException(status_code=500, detail=str(e))





@router.get("/device/status", response_model=dict)
def get_device_status(db: Session = Depends(get_db)):
    try:
        # Call device_status without IAQ data
        latest_data = connect.device_status(db, None)  
        return latest_data  
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/iaq", response_model=dict)
def read_total_count(db: Session = Depends(get_db)):
    try:
        latest_data = services.get_latest_iaq(db)
        if latest_data:
            return latest_data
        else:
            raise HTTPException(status_code=404, detail="No IAQ data found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    


@router.get("/list/iaq", response_model=List[dict])
def read_total_count(db: Session = Depends(get_db)):
    try:
        latest_data = services.get_last_iaq(db)
        if latest_data:
            return latest_data  # This will now return a list of dicts
        else:
            raise HTTPException(status_code=404, detail="No IAQ data found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/alerts", response_model=list[schema.Alerts]) 
async def get_alerts(db: Session = Depends(get_db)):
    alerts = services.get_latest_alerts(db)
    return alerts


@router.get("/ruleengine/all", response_model=list[schema.RuleConditon])
def read_rule_conditions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    rule_conditions = services.get_ruleconditions(db, skip=skip, limit=limit)
    return rule_conditions

# Get Specific severity
@router.get("/ruleengine/{rule_type_id}", response_model=schema.RuleConditon)
def get_rulecondition(rule_type_id: int, db: Session = Depends(get_db)):
    db_rulecondition = services.get_rulecondition(db, rule_type_id=rule_type_id)
    if db_rulecondition is None:
        raise HTTPException(status_code=404, detail=Message.RuleEngine_NOT_FOUND)
    return db_rulecondition

# Create severity
@router.post("/ruleengine", response_model=schema.RuleConditon)
def create_rulecondition(rule: schema.RuleConditonCreate, db: Session = Depends(get_db)):
    return services.create_rulecondition(db=db, rulecondition=rule)


# Update severity
@router.put("/ruleengine/{rule_type_id}", response_model=schema.RuleConditon)
def update_rulecondition(rule_type_id: int, rule_condition: schema.RuleConditonUpdate, db: Session = Depends(get_db)):
    db_severity = services.get_rulecondition(db, rule_type_id=rule_type_id)
    if db_severity is None:
        raise HTTPException(status_code=404, detail=Message.RuleEngine_NOT_FOUND)
    return services.update_rule_conditon(db=db, rule_type_id=rule_type_id, rule_condition=rule_condition)

# Delete severity
@router.delete("/ruleengine/{rule_type_id}")
def delete_rulecondition(rule_type_id: int, db: Session = Depends(get_db)):
    db_severity = services.get_rulecondition(db, rule_type_id=rule_type_id)
    if db_severity is None:
        raise HTTPException(status_code=404, detail=Message.RuleEngine_NOT_FOUND)
    services.delete_severities(db=db, rule_type_id=rule_type_id)
    
    response = {
        "status": True,
        "message": Message.Asset_DELETED
    }
    return response


@router.get("/temperature")
async def get_temperature(city: str = Query(default="Bangalore", title="City", description="City to get the temperature for")):
    temperature = services.get_temperature_from_google(city)
    return {"city": city, "temperature": temperature}

# @router.get("/aqi")
# async def get_aqi(city: str = Query(default="bangalore/peenya", title="City", description="City to get the AQI for")):
#     aqi_data = services.get_aqi_from_aqicn(city)  # Call the modified function
#     if "error" in aqi_data:  # Check if there's an error in the returned data
#         return {"city": city, "error": aqi_data["error"]}
#     return {"city": city, "aqi_data": aqi_data}

@router.get("/aqi")
async def get_aqi(city: str = Query(default="bengaluru/hebbal", title="City", description="City to get the AQI for")):
    aqi_data = services.get_aqi_from_aqicn(city)  # Call the modified function
    if "error" in aqi_data:  # Check if there's an error in the returned data
        return {"city": city, "error": aqi_data["error"]}
    return {"city": city, "aqi_data": aqi_data}


@router.get("/download/alerts/csv")
def download_footfall_report(
    start_date: Optional[str] = Query(None, description="Start date for filtering", example="01-09-2024", regex=r"\d{2}-\d{2}-\d{4}"),
    end_date: Optional[str] = Query(None, description="End date for filtering", example="30-09-2024", regex=r"\d{2}-\d{2}-\d{4}"),
    db: Session = Depends(get_db)
):
    
    if start_date:
        try:
            start_date = datetime.strptime(start_date, "%d-%m-%Y").date()
        except ValueError:
            raise HTTPException(status_code=422, detail="Invalid start_date format. Please use DD-MM-YYYY.")
    
    if end_date:
        try:
            end_date = datetime.strptime(end_date, "%d-%m-%Y").date()
        except ValueError:
            raise HTTPException(status_code=422, detail="Invalid end_date format. Please use DD-MM-YYYY.")

    
    df = services.fetch_reports_alerts(db, start_date=start_date, end_date=end_date)

    
    with NamedTemporaryFile(delete=False, suffix='.csv') as temp_file:
        df.to_csv(temp_file.name, index=False)
    
    
    if os.path.exists(temp_file.name):
        return FileResponse(
            temp_file.name, 
            filename="footfall_report.csv", 
            media_type="text/csv", 
            headers={"Content-Disposition": "attachment; filename=footfall_report.csv"}
        )
    else:
        raise HTTPException(status_code=404, detail="CSV file not found")



@router.get("/download/data/csv")
def download_footfall_report(
    start_date: Optional[str] = Query(None, description="Start date for filtering", example="01-09-2024", regex=r"\d{2}-\d{2}-\d{4}"),
    end_date: Optional[str] = Query(None, description="End date for filtering", example="30-09-2024", regex=r"\d{2}-\d{2}-\d{4}"),
    db: Session = Depends(get_db)
):
    
    if start_date:
        try:
            start_date = datetime.strptime(start_date, "%d-%m-%Y").date()
        except ValueError:
            raise HTTPException(status_code=422, detail="Invalid start_date format. Please use DD-MM-YYYY.")
    
    if end_date:
        try:
            end_date = datetime.strptime(end_date, "%d-%m-%Y").date()
        except ValueError:
            raise HTTPException(status_code=422, detail="Invalid end_date format. Please use DD-MM-YYYY.")

    
    df = services.fetch_iaq_reports(db, start_date=start_date, end_date=end_date)

    
    with NamedTemporaryFile(delete=False, suffix='.csv') as temp_file:
        df.to_csv(temp_file.name, index=False)
    
    
    if os.path.exists(temp_file.name):
        return FileResponse(
            temp_file.name, 
            filename="footfall_report.csv", 
            media_type="text/csv", 
            headers={"Content-Disposition": "attachment; filename=footfall_report.csv"}
        )
    else:
        raise HTTPException(status_code=404, detail="CSV file not found")
    
from typing import Dict

@router.get("/week/entry/", response_model=Dict[str, Dict[str, Optional[float]]])  
def read_weekly_count(db: Session = Depends(get_db)):
    try:
        # Call the weekly_aqi_mean function
        weekly_data = services.weekly_aqi_mean(db)
        
        return weekly_data
    except Exception as e:
        # Handle and raise HTTPException if any error occurs
        raise HTTPException(status_code=500, detail="An internal server error occurred")
    
from typing import Any    
@router.get("/kpi/peak-low", response_model=Dict[str, Dict[str, Any]])
def read_kpi_peak_low(db: Session = Depends(get_db)) -> Dict[str, Dict[str, Any]]:
    
    return services.get_peak_and_low_kpi_hour(db)

@router.get("/aqi-hourly-data")
def get_aqi_hourly_data(db: Session = Depends(get_db)):
    return services.aqi_hour_data(db)


@router.get("/temp-hourly-data")
def get_aqi_hourly_data(db: Session = Depends(get_db)):
    return services.temp_hour_data(db)