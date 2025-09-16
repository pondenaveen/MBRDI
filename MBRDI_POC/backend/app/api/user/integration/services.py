from sqlalchemy.orm import Session,joinedload
from fastapi import HTTPException, status
from . import schema
from app.api.integration.models import IaqModel,RuleEngineModel,AlertsModel,AQIHourModel,TempHourModel
from datetime import datetime, time,timedelta
import json
import calendar
from typing import Dict,List
import json


def get_latest_iaq(db: Session):
    latest_record = db.query(IaqModel.data).order_by(IaqModel.created_at.desc()).first()
    if latest_record:
        return json.loads(latest_record[0]) 
    return None

# def get_latest_iaq(db: Session):
#     # Query to get the latest record by created_at in descending order
#     latest_record = db.query(IaqModel).order_by(IaqModel.created_at.desc()).first()
    
#     if latest_record:
#         # Ensure that the record exists and return only the created_at within data
#         return {
#             "data": {
#                 **json.loads(latest_record.data),  # Unpack the existing data
#                 "created_at": latest_record.created_at  # Include created_at in the data
#             }
#         }
    
#     return {"data": {"created_at": None}} 

def get_last_iaq(db: Session):
    # Retrieve the last 20 records along with their created_at timestamps
    latest_records = db.query(IaqModel.data, IaqModel.created_at).order_by(IaqModel.created_at.desc()).limit(20).all()
    if latest_records:
        # Return a list of dictionaries containing data and created_at
        return [
            {"data": json.loads(record[0]), "created_at": record[1]} 
            for record in reversed(latest_records)  # Reverse to return the latest last
        ]
    return None

def get_latest_alerts(db: Session):
    return db.query(AlertsModel).order_by(AlertsModel.created_at.desc()).limit(20).all()

# Get all ruleconditions
def get_ruleconditions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(RuleEngineModel).offset(skip).limit(limit).all()

# Get a single rule_condition
def get_rulecondition(db: Session, rule_type_id: int):
    return db.query(RuleEngineModel).filter(RuleEngineModel.id == rule_type_id).first()

# Get a Single rule_condition By Name
def get_rulecondition_by_name(db: Session, name: str):
    return db.query(RuleEngineModel).filter(RuleEngineModel.device == name).first()

# Create a new rule_condition
# def create_rulecondition(db: Session, rulecondition: schema.RuleConditonCreate):
#     db_rulecondition= RuleEngineModel(**rulecondition.dict())
#     db.add(db_rulecondition)
#     db.commit()
#     db.refresh(db_rulecondition)

#     return db_rulecondition

def create_rulecondition(db: Session, rulecondition: schema.RuleConditonCreate):
    # Fetch existing rules for the same KPI and device
    existing_rules = db.query(RuleEngineModel).filter(
        RuleEngineModel.kpi == rulecondition.kpi,
        RuleEngineModel.device == rulecondition.device
    ).all()

    # Handle min_value and max_value with None checks
    rulecondition_min_value = float(rulecondition.min_value) if rulecondition.min_value else None
    rulecondition_max_value = float(rulecondition.max_value) if rulecondition.max_value else None

    tolerance = 0.1  # Adjust tolerance as needed

    # Logic to validate the new rule
    for rule in existing_rules:
        rule_min_value = float(rule.min_value) if rule.min_value else None
        rule_max_value = float(rule.max_value) if rule.max_value else None

        # Skip saving if there's an exact same rule (min/max value)
        if (rule_min_value == rulecondition_min_value) and (rule_max_value == rulecondition_max_value):
            raise ValueError(f"Rule with {rulecondition.kpi}: {rulecondition.min_value} - {rulecondition.max_value} already exists.")

        # Check if the new rule's range overlaps with any existing rule
        overlap_exists = False

        if rule_min_value is not None and rule_max_value is not None:
            # Check if the ranges overlap
            if (
                (rulecondition_max_value is not None and rule_min_value <= (rulecondition_max_value - tolerance) <= rule_max_value) or
                (rulecondition_min_value is not None and rule_min_value <= (rulecondition_min_value + tolerance) <= rule_max_value)
            ):
                overlap_exists = True

        if overlap_exists:
            raise ValueError(f"Overlapping rule for {rulecondition.kpi} already exists in the range {rule.min_value} - {rule.max_value}.")
    
    # If no conflict, create the rule
    db_rulecondition = RuleEngineModel(**rulecondition.dict())
    db.add(db_rulecondition)
    db.commit()
    db.refresh(db_rulecondition)

    return db_rulecondition


# Update an existing rule_condition
def update_rule_conditon(db: Session, rule_type_id: int, rule_condition: schema.RuleConditonUpdate):
    db_rule_conditon = db.query(RuleEngineModel).filter(RuleEngineModel.id == rule_type_id)
    if db_rule_conditon.first() is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'RuleConditon with id {rule_type_id} not found')
    db_rule_conditon.update(rule_condition.dict())
    db.commit()
    update_rule_conditon = db.query(RuleEngineModel).filter(RuleEngineModel.id == rule_type_id).first()
    return update_rule_conditon.__dict__

# Delete an existing rule_condition
def delete_severities(db: Session, rule_type_id: int):
    db_rulecondition = db.query(RuleEngineModel).filter(RuleEngineModel.id == rule_type_id).first()
    if db_rulecondition is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'rule_condition with id {rule_type_id} not found')
    db.delete(db_rulecondition)
    db.commit()
    return db_rulecondition

import requests
from bs4 import BeautifulSoup

def get_temperature_from_google(city: str):
    url = f"https://www.google.com/search?q=weather+{city}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"}
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    temperature_info = soup.find("div", class_="BNeawe").text.split('\u200e')[0]
    temperature = temperature_info.split()[0]
    return temperature





def get_aqi_from_aqicn(city: str):
    # Construct the URL based on the provided city
    url = f"https://aqicn.org/city/india/{city}/"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
    }
    response = requests.get(url, headers=headers)
    
    if response.status_code != 200:
        return {"error": "Failed to retrieve data"}  # Handle the error as needed
    
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Initialize a dictionary to hold the data
    aqi_data = {}

    # Extract AQI value
    aqi_element = soup.find("div", class_="aqivalue")
    if aqi_element:
        aqi_data["aqi"] = aqi_element.text.strip()  # Get the AQI value

    # Extract pollutants information
    pollutants = soup.find("div", class_="pollutants")
    if pollutants:
        for pollutant in pollutants.find_all("div", class_="iaqi"):
            pollutant_name = pollutant.find("div", class_="pollutant-name").text.strip()
            pollutant_value = pollutant.find("div", class_="pollutant-value").text.strip()
            aqi_data[pollutant_name] = pollutant_value

    # Extract health recommendations
    health_element = soup.find("div", class_="health-recommendation")
    if health_element:
        aqi_data["health_recommendation"] = health_element.text.strip()  # Get health recommendations

    return aqi_data if aqi_data else {"error": "No data found"}



from sqlalchemy import func
import pandas as pd
def fetch_reports_alerts(db, start_date=None, end_date=None):
    query = db.query(AlertsModel)
    if start_date and end_date:
        query = query.filter(func.date(AlertsModel.created_at) >= start_date,
                             func.date(AlertsModel.created_at) <= end_date)
    
    
    alert_data = query.all()

    
    data = {
        "kpi": [alert.kpi for alert in alert_data],
        "Device": [alert.Device for alert in alert_data],
        "value": [alert.value for alert in alert_data],
        'max_value' : [alert.max_value for alert in alert_data],
        'min_value' : [alert.min_value for alert in alert_data],
        'severity' : [alert.severity for alert in alert_data],
        "site": [alert.site for alert in alert_data],  
        "building": [alert.building for alert in alert_data],
        "floor": [alert.floor for alert in alert_data],  
        "zone": [alert.zone for alert in alert_data],  
        "time_stamp": [alert.created_at for alert in alert_data]
    }

    
    df = pd.DataFrame(data)
    return df


def fetch_iaq_reports(db, start_date=None, end_date=None):
    
    
    
    query = db.query(IaqModel)

    
    if start_date and end_date:
        query = query.filter(func.date(IaqModel.created_at) >= start_date,
                             func.date(IaqModel.created_at) <= end_date)

    
    iaq_data = query.all()

    # Prepare the data for the DataFrame
    report_data = []
    
    for entry in iaq_data:
        # Assuming the data field contains a JSON-like structure
        kpi_values = eval(entry.data)  # Convert string representation of dict to dict
        location = entry.location
        site = entry.site
        building = entry.building
        floor = entry.floor
        zone = entry.zone
        time_stamp = entry.created_at

        # Iterate over each KPI in the data, excluding specific keys
        for kpi, value in kpi_values.items():
            if kpi not in ['CarbonFootprint', 'deviceId']:
                report_data.append({
                    'KPI': kpi,
                    'Value': value,
                    'Location': location,
                    'Site': site,
                    'Building': building,
                    'Floor': floor,
                    'Zone': zone,
                    "time_stamp" : time_stamp,
                })

    # Create a DataFrame from the processed report data
    df = pd.DataFrame(report_data)
    return df


def weekly_aqi_mean(db: Session) -> Dict[str, Dict[str, float]]:
    today = datetime.now().date()

    
    weekly_means = {day: {'AQI': None} for day in calendar.day_name}

    
    start_of_week = today - timedelta(days=today.weekday())  
    end_of_week = start_of_week + timedelta(days=6)  

    # Loop through each day from Monday to Sunday
    for i in range(7):  # Loop through 7 days (Monday to Sunday)
        current_day = start_of_week + timedelta(days=i)
        start_of_day_datetime = datetime.combine(current_day, datetime.min.time())
        end_of_day_datetime = datetime.combine(current_day, datetime.max.time())
        
        # Query the database for entries for the current day
        day_data = db.query(AQIHourModel).filter(
            AQIHourModel.start_date >= start_of_day_datetime,
            AQIHourModel.start_date <= end_of_day_datetime
        ).all()

        # Process the current day's data
        total_aqi = 0.0
        count_aqi = 0

        for record in day_data:
            try:
                aqi_value = float(record.aqi)  
                total_aqi += aqi_value
                count_aqi += 1
            except Exception as e:
                print(f'Error processing {calendar.day_name[current_day.weekday()]}\'s record: {e}')

        # Calculate the mean AQI for the current day if there is data
        if count_aqi > 0:
            mean_aqi = round(total_aqi / count_aqi, 2)  # Round to 2 decimal places
            day_name = calendar.day_name[current_day.weekday()]
            weekly_means[day_name]['AQI'] = mean_aqi

    print(f"Weekly means: {weekly_means}")  # Debugging statement
    return weekly_means

from datetime import datetime, date
def get_peak_and_low_kpi_hour(db: Session) -> Dict[str, Dict[str, List[Dict[str, str]]]]:
    # Get today's date
    today = date.today()
    
    # Query to get all data for today
    records = db.query(IaqModel).filter(
        IaqModel.created_at >= datetime.combine(today, datetime.min.time()),
        IaqModel.created_at <= datetime.combine(today, datetime.max.time())
    ).all()

    # Initialize data structure to hold KPI values
    kpi_data = {
        'Temp': [],
        'Hum': [],
        'TVOC': [],
        'CO2': [],
        'pm10': [],
        'pm25': [],
        'AQI': [],
        'CarbonFootprint': [],
    }
    
    # Parse the records
    for record in records:
        data_dict = json.loads(record.data)    
        for key in kpi_data.keys():
            if key in data_dict:
                kpi_data[key].append({
                    'value': data_dict[key],
                    'timestamp': record.created_at
                })

    # Initialize result structure
    result = {
        'peak': {},
        'low': {}
    }

    # Calculate peak and low for each KPI
    for kpi, values in kpi_data.items():
        if values:  # Only process if there are values
            peak = max(values, key=lambda x: x['value'], default=None)
            low = min(values, key=lambda x: x['value'], default=None)
            result['peak'][kpi] = peak
            result['low'][kpi] = low

    return result


def aqi_hour_data(db: Session):
    # Get today's date
    today = datetime.now().date()

    # Calculate the start and end of the day for the query
    start_of_day = datetime.combine(today, datetime.min.time())
    end_of_day = datetime.combine(today, datetime.max.time())

    # Query for AQI data for today
    aqi_data_today = db.query(AQIHourModel).filter(
        AQIHourModel.start_date >= start_of_day,
        AQIHourModel.end_date <= end_of_day
    ).all()

    # Prepare a dictionary for easier access, with hour index starting from 0 to 23
    aqi_dict = {}
    for hour in aqi_data_today:
        # Extract the hour part from the start date
        hour_index = hour.start_date.split(' ')[1][:2]  # "HH" from "YYYY-MM-DD HH:MM:SS"
        aqi_dict[int(hour_index)] = hour.aqi  # Store AQI by hour index

    # Prepare the response in the desired format
    response_data = {}
    for hour in range(24):
        # Use hour + 1 for 1st hour, 2nd hour, ..., 24th hour representation
        hour_label = f"{hour + 1}st hour" if hour + 1 == 1 else f"{hour + 1}th hour"
        if hour in aqi_dict:
            response_data[hour_label] = aqi_dict[hour]
        else:
            response_data[hour_label] = "No data"

    return response_data



def temp_hour_data(db: Session):
    
    today = datetime.now().date()

    
    start_of_day = datetime.combine(today, datetime.min.time())
    end_of_day = datetime.combine(today, datetime.max.time())

    # Query for Temp and Hum data for today
    temp_hum_data_today = db.query(TempHourModel).filter(
        TempHourModel.start_date >= start_of_day,
        TempHourModel.end_date <= end_of_day
    ).all()

    
    temp_dict = {}
    hum_dict = {}
    for hour in temp_hum_data_today:
        
        hour_index = int(hour.start_date.split(' ')[1][:2])  
        temp_dict[hour_index] = hour.Temp  
        hum_dict[hour_index] = hour.Hum  

    
    response_data = {}
    for hour in range(24):
        
        hour_label = f"{hour + 1}st hour" if hour == 0 else f"{hour + 1}th hour"
        if hour in temp_dict:
            
            response_data[hour_label] = {
                "Temp": temp_dict[hour],
                "Hum": hum_dict[hour]
            }
        else:
            
            response_data[hour_label] = "No data"

    return response_data
