from fastapi import APIRouter, Depends
import paho.mqtt.client as mqtt
from sqlalchemy.orm import Session
from app.database.base import get_db
from app.api.integration.models import IaqModel,RuleEngineModel,AlertsModel,AQIHourModel,TempHourModel
import json

router = APIRouter()
# AQI calculation helper
def calculate_aqi(concentration, breakpoints):
    C_low, C_high, I_low, I_high = breakpoints
    return round(((I_high - I_low) / (C_high - C_low)) * (concentration - C_low) + I_low)

# Carbon footprint calculation based on CO2 concentration and energy metrics
def calculate_carbon_footprint(co2_ppm, total_energy_consumption, green_energy_percentage, volume=100):
    # Calculate non-green energy consumption
    non_green_energy_consumption = total_energy_consumption * (1 - green_energy_percentage)
    
    # Emission factor for grid electricity in kg CO2 per kWh
    emission_factor = 0.9  # kg CO2 per kWh
    # Calculate the carbon footprint based on CO2 ppm and the energy consumed
    co2_emission = co2_ppm * 0.0000018 * volume  # Original calculation based on ppm
    non_green_emission = non_green_energy_consumption * emission_factor

    # Total carbon footprint as an integer
    return int(co2_emission + non_green_emission)


# Calculate AQI for PM10
def get_pm10_aqi(pm10):
    if pm10 <= 54.0:
        return calculate_aqi(pm10, (0, 54.0, 0, 50))
    elif 55 <= pm10 <= 154:
        return calculate_aqi(pm10, (55, 154, 51, 100))
    elif 155 <= pm10 <= 254:
        return calculate_aqi(pm10, (155, 254, 101, 150))
    elif 255 <= pm10 <= 354:
        return calculate_aqi(pm10, (255, 354, 151, 200))
    elif 355 <= pm10 <= 424:
        return calculate_aqi(pm10, (355, 424, 201, 300))
    elif 425 <= pm10 <= 504:
        return calculate_aqi(pm10, (425, 504, 301, 400))
    else:
        return 500  # Hazardous

# Calculate AQI for PM2.5
def get_pm25_aqi(pm25):
    if pm25 <= 12.0:
        return calculate_aqi(pm25, (0, 12.0, 0, 50))
    elif 12.1 <= pm25 <= 35.4:
        return calculate_aqi(pm25, (12.1, 35.4, 51, 100))
    elif 35.5 <= pm25 <= 55.4:
        return calculate_aqi(pm25, (35.5, 55.4, 101, 150))
    elif 55.5 <= pm25 <= 150.4:
        return calculate_aqi(pm25, (55.5, 150.4, 151, 200))
    elif 150.5 <= pm25 <= 250.4:
        return calculate_aqi(pm25, (150.5, 250.4, 201, 300))
    elif 250.5 <= pm25 <= 500.4:
        return calculate_aqi(pm25, (250.5, 500.4, 301, 400))
    else:
        return 500  # Hazardous

# Calculate AQI for CO2 (in ppm or relevant units)
def get_co2_aqi(co2):
    if co2 <= 400:  # Good
        return calculate_aqi(co2, (0, 400, 0, 50))
    elif 401 <= co2 <= 1000:  # Moderate
        return calculate_aqi(co2, (401, 1000, 51, 100))
    elif 1001 <= co2 <= 2000:  # Unhealthy for sensitive groups
        return calculate_aqi(co2, (1001, 2000, 101, 150))
    elif 2001 <= co2 <= 3000:  # Unhealthy
        return calculate_aqi(co2, (2001, 3000, 151, 200))
    elif 3001 <= co2 <= 5000:  # Very Unhealthy
        return calculate_aqi(co2, (3001, 5000, 201, 300))
    else:
        return 500  # Hazardous


def get_temp_aqi(temp):
    # Define breakpoints for temperature AQI
    if temp <= 20:
        return calculate_aqi(temp, (0, 20, 0, 50))
    elif 21 <= temp <= 25:
        return calculate_aqi(temp, (21, 25, 51, 100))
    elif 26 <= temp <= 30:
        return calculate_aqi(temp, (26, 30, 101, 150))
    elif 31 <= temp <= 35:
        return calculate_aqi(temp, (31, 35, 151, 200))
    elif 36 <= temp <= 40:
        return calculate_aqi(temp, (36, 40, 201, 300))
    else:
        return 500  # Hazardous

def get_hum_aqi(humidity):
    # Define breakpoints for humidity AQI
    if humidity <= 30:
        return calculate_aqi(humidity, (0, 30, 0, 50))
    elif 31 <= humidity <= 60:
        return calculate_aqi(humidity, (31, 60, 51, 100))
    elif 61 <= humidity <= 80:
        return calculate_aqi(humidity, (61, 80, 101, 150))
    elif 81 <= humidity <= 90:
        return calculate_aqi(humidity, (81, 90, 151, 200))
    else:
        return 500  # Hazardous

def get_tvoc_aqi(tvoc):
    # Define breakpoints for TVOC AQI in ppb
    if tvoc <= 50:
        return calculate_aqi(tvoc, (0, 50, 0, 50))
    elif 51 <= tvoc <= 100:
        return calculate_aqi(tvoc, (51, 100, 51, 100))
    elif 101 <= tvoc <= 150:
        return calculate_aqi(tvoc, (101, 150, 101, 150))
    elif 151 <= tvoc <= 200:
        return calculate_aqi(tvoc, (151, 200, 151, 200))
    elif 201 <= tvoc <= 300:
        return calculate_aqi(tvoc, (201, 300, 201, 300))
    else:
        return 500  # 

# MQTT Callbacks
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to MQTT Broker")
        client.subscribe("kaiterra/device/history/+")
    else:
        print(f"Failed to connect to MQTT Broker with result code {rc}")

# def on_message(client, userdata, message):
#     try:
#         payload = message.payload.decode('utf-8')
#         data = json.loads(payload)
#         db = next(get_db())  # Get DB session

#         result = {}

#         if message.topic.startswith("kaiterra/device/history/"):
#             if 'data' in data and isinstance(data['data'], dict):
#                 result["CO2"] = data["data"].get("co2")
#                 result["Hum"] = int(data["data"].get("humidity"))
#                 result["TVOC"] = data["data"].get("tvoc")
#                 result["Temp"] = data["data"].get("temperature")
#                 result["pm10"] = data["data"].get("pm10")
#                 result["pm25"] = data["data"].get("pm25")
#                 result["deviceId"] = "IAQ-1"

#                 # Calculate AQI for pm10, pm25, and CO2
#                 pm10_aqi = get_pm10_aqi(result["pm10"])
#                 pm25_aqi = get_pm25_aqi(result["pm25"])
#                 co2_aqi = get_co2_aqi(result["CO2"])
#                 temp_aqi = get_temp_aqi(result["Temp"])
#                 hum_aqi = get_hum_aqi(result["Hum"])
#                 tvoc_aqi = get_tvoc_aqi(result["TVOC"])
#                 print(f'pm10_aqi:{pm10_aqi},pm25_aqi:{pm25_aqi},co2_aqi:{co2_aqi},temp_aqi:{temp_aqi},hum_aqi:{hum_aqi},tvoc_aqi:{tvoc_aqi}')
#                 # Final AQI is the highest of all three
#                 # result["AQI"] = (pm25_aqi)
#                 result["AQI"] = max((pm10_aqi,pm25_aqi,co2_aqi))#,temp_aqi,hum_aqi,tvoc_aqi))
#                 #result["AQI"] = round((pm10_aqi + pm25_aqi + co2_aqi + temp_aqi + hum_aqi + tvoc_aqi) / 6)

                
#                 total_energy_consumption = 10000  
#                 green_energy_percentage = 0.30  

#                 # Calculate carbon footprint based on CO2 level and energy metrics
#                 carbon_footprint = calculate_carbon_footprint(result["CO2"], total_energy_consumption, green_energy_percentage)

#                 # Prepare IAQ data to store in DB
#                 iaq_data = {
#                     "CO2": result.get("CO2", 0),
#                     "Hum": result.get("Hum", 0),
#                     "TVOC": result.get("TVOC", 0),
#                     "Temp": result.get("Temp", 0),
#                     "pm10": result.get("pm10", 0),
#                     "pm25": result.get("pm25", 0),
#                     "AQI": result["AQI"],
#                     "CarbonFootprint": carbon_footprint,
#                     "deviceId": result.get("deviceId", "")
#                 }
#                 my_payloads(db, iaq_data)

#                 print(f"IAQ data to save: {iaq_data}")

#                 new_iaq = IaqModel(
#                     data=json.dumps(iaq_data),
#                     location=result.get("deviceId", ""),
#                     site="MBRDI",
#                     building="EC1",
#                     floor="SIXTH FLOOR",
#                     zone="A-zone"
#                 )
#                 db.add(new_iaq)
#                 db.commit()

#                 # Additional data storage or processing
#                 aqi_data(db, iaq_data)
#                 device_status(db, iaq_data)
#                 Temp_data(db, iaq_data)

#             else:
#                 print("Unexpected data structure in MQTT message")

#     except json.JSONDecodeError:
#         print("Failed to decode JSON")
#     except Exception as e:
#         print(f"An error occurred: {e}")

def on_message(client, userdata, message):
    try:
        payload = message.payload.decode('utf-8')
        data = json.loads(payload)
        db = next(get_db())  # Get DB session

        result = {}

        if message.topic.startswith("kaiterra/device/history/"):
            if 'data' in data and isinstance(data['data'], dict):
                result["CO2"] = data["data"].get("co2")
                result["Hum"] = int(data["data"].get("humidity"))
                result["TVOC"] = data["data"].get("tvoc")
                result["Temp"] = data["data"].get("temperature")
                result["pm10"] = data["data"].get("pm10")
                
                # Get actual pm25 value (may be 0)
                result["pm25"] = data["data"].get("pm25", 0)
                
                # Adjust pm25 for AQI calculation (if 0, use 1)
                pm25_for_aqi = 1 if result["pm25"] == 0 else result["pm25"]
                
                result["deviceId"] = "IAQ-1"

                # Calculate AQI using adjusted pm25 value
                pm25_aqi = get_pm25_aqi(pm25_for_aqi)
                result["AQI"] = pm25_aqi

                print(f'pm25_aqi (adjusted): {pm25_aqi}')

                # Calculate carbon footprint and store data
                total_energy_consumption = 10000  
                green_energy_percentage = 0.30  
                carbon_footprint = calculate_carbon_footprint(result["CO2"], total_energy_consumption, green_energy_percentage)

                # Prepare IAQ data to store in DB
                iaq_data = {
                    "CO2": result.get("CO2", 0),
                    "Hum": result.get("Hum", 0),
                    "TVOC": result.get("TVOC", 0),
                    "Temp": result.get("Temp", 0),
                    "pm10": result.get("pm10", 0),
                    "pm25": result.get("pm25", 0),  # Store the actual pm25 value (including 0)
                    "AQI": result["AQI"],
                    "CarbonFootprint": carbon_footprint,
                    "deviceId": result.get("deviceId", "")
                }
                my_payloads(db, iaq_data)

                print(f"IAQ data to save: {iaq_data}")

                new_iaq = IaqModel(
                    data=json.dumps(iaq_data),
                    location=result.get("deviceId", ""),
                    site="MBRDI",
                    building="EC1",
                    floor="SIXTH FLOOR",
                    zone="A-zone"
                )
                db.add(new_iaq)
                db.commit()

                # Additional data storage or processing
                aqi_data(db, iaq_data)
                device_status(db, iaq_data)
                Temp_data(db, iaq_data)

            else:
                print("Unexpected data structure in MQTT message")

    except json.JSONDecodeError:
        print("Failed to decode JSON")
    except Exception as e:
        print(f"An error occurred: {e}")



# MQTT Client Setup
def start_subscribe():
    print("Started subscribing to MQTT broker")
    mqtt_client = mqtt.Client()
    mqtt_client.on_connect = on_connect
    mqtt_client.on_message = on_message
    mqtt_client.connect("164.52.197.111", 1883)  
    mqtt_client.loop_start()


def my_payloads(db: Session, iaq_data):
    payload_device = iaq_data.get("deviceId", "")  
    print(payload_device)
    kpi_data = {
        "Temp": iaq_data.get("Temp"),
        "Hum": iaq_data.get("Hum"),
        "CO2": iaq_data.get("CO2"),
        "TVOC": iaq_data.get("TVOC"),
        "pm10": iaq_data.get("pm10"),
        "pm25": iaq_data.get("pm25"),
        "AQI": iaq_data.get("AQI")  
    }
    print(f"KPI data: {kpi_data}")
    
    # Query the rules from RuleEngineModel for the device
    rules = db.query(RuleEngineModel).filter_by(device=payload_device).all()
    
    if not rules:
        print(f"No rules found for device: {payload_device}")
        return {"count": 0, "alerts": []} 
    
    location_data = db.query(IaqModel).filter_by(location=payload_device).first()
    
    if not location_data:
        print(f"No location details found for device: {payload_device}")
        return {"count": 0, "alerts": []}  
    
    matched_kpis = []  
    
    for rule in rules:
        print(f"Evaluating rule for device: {payload_device}, KPI: {rule.kpi}")  
        payload_kpi_name = rule.kpi
        
        # Get the payload value, defaulting to None if not present
        payload_value = kpi_data.get(payload_kpi_name)
        
        # Ensure payload_value is not None
        if payload_value is None:
            print(f"Payload value for {payload_kpi_name} is None.")
            continue
        
        # Convert the values from RuleEngineModel
        max_value = float(rule.max_value) if rule.max_value.strip() else 0.01
        min_value = float(rule.min_value) if rule.min_value.strip() else 0.01
        
        # Convert payload_value to float
        try:
            payload_value = float(payload_value)
        except ValueError:
            print(f"Value for {payload_kpi_name} cannot be converted to float: {payload_value}")
            continue
        
        operator = rule.operator
        severity = rule.severity
        
        # Perform operator-based comparison for the current rule
        if (operator == '<' and payload_value < max_value) or (operator == '>' and payload_value > max_value) or (operator == "<=" and  payload_value <= max_value) or (operator == ">=" and  payload_value >= max_value) or (operator == "==" and  payload_value == max_value) or (operator == '><' and not (min_value <= payload_value <= max_value)) or (operator == '<>' and (max_value > payload_value > min_value)):
            
            # If the condition is met, append KPI, value, and location details
            matched_kpis.append({
                "KPI": payload_kpi_name,
                "Value": payload_value,
                "Device": payload_device,
                "Max_value": max_value,
                "Min_value": min_value,
                "Severity": severity,
                "Site": location_data.site,
                "Building": location_data.building,
                "Floor": location_data.floor,
                "Zone": location_data.zone
            })

    # If there are any matched KPIs (alerts), save them to AlertsModel
    if matched_kpis:
        for match in matched_kpis:
            alert = AlertsModel(
                kpi=match["KPI"],
                value=str(match["Value"]),
                Device=match["Device"],
                max_value=match["Max_value"],
                min_value=match["Min_value"],
                severity=match["Severity"],
                site=match["Site"],
                building=match["Building"],
                floor=match["Floor"],
                zone=match["Zone"]
            )
            db.add(alert)  # Add the alert to the session
            print(alert)
        
        db.commit()  # Commit all the new alerts to the database
        alert_count = len(matched_kpis)  # Count how many alerts were triggered
        print(alert_count)
        print(matched_kpis)
        
        # Return the count of alerts and the list of all matched alerts
        return {
            "count": alert_count,
            "alerts": matched_kpis,  # Return all matched KPI alerts
            "timestamp" : datetime.now()
        }
    
    # If no matching rules are found, return zero alerts
    print("No matching rules found.")
    return {"count": 0, "alerts": []}






from datetime import datetime,timedelta
aqi_values = []



def aqi_data(db: Session, iaq_data):
    """Process the incoming payload to extract AQI values, calculate statistics, and save results."""
    
    # Extract the AQI value from the incoming data
    aqi_value = iaq_data.get("AQI", 0)
    print(f"Extracted AQI Value: {aqi_value}")
    
    # Check if the AQI value is being correctly extracted
    if aqi_value is None:
        print("AQI value not found in the payload.")
        return
    
    # Get the current timestamp and calculate the hour range
    current_time = datetime.now()
    start_date = current_time.replace(minute=0, second=0, microsecond=0)  # Start of the hour
    end_date = start_date + timedelta(hours=1) - timedelta(seconds=1)  # End of the hour

    # Check if a record already exists for the current hour
    existing_record = db.query(AQIHourModel).filter(
        AQIHourModel.start_date == start_date.strftime("%Y-%m-%d %H:%M:%S"),
        AQIHourModel.end_date == end_date.strftime("%Y-%m-%d %H:%M:%S")
    ).first()

    # Use a list to keep track of AQI values for the hour
    aqi_values = []  # Initialize this list, assuming it is defined somewhere globally or passed in.

    # Add the current AQI value to the list
    aqi_values.append(aqi_value)
    
    # Compute the sum and count of AQI values
    aqi_count = len(aqi_values)
    aqi_sum = sum(aqi_values)
    mean_aqi = round(aqi_sum / aqi_count, 2) if aqi_count > 0 else 0.0  

    # Print the list, count, and mean of AQI values
    print(f"AQI List: {aqi_values}")
    print(f"AQI Count: {aqi_count}")
    print(f"Mean AQI: {mean_aqi:.2f} at {current_time}")

    # If a record exists, update the AQI value
    if existing_record:
        existing_record.aqi = str(mean_aqi)  # Update the mean AQI value
        db.commit()
        print("Mean AQI updated in the AQIHourModel.")
    else:
        # Store the mean AQI in the database for the first record of the hour
        aqi_record = AQIHourModel(
            aqi=str(mean_aqi),  # Store mean AQI as a string
            start_date=start_date.strftime("%Y-%m-%d %H:%M:%S"),  # Format the start date
            end_date=end_date.strftime("%Y-%m-%d %H:%M:%S")  # Format the end date
        )
        
        # Add the new record to the session
        db.add(aqi_record)
        
        # Commit the changes to the database
        db.commit()
        print("Mean AQI saved to the AQIHourModel.")


from datetime import datetime, timedelta

last_update_time = None

def device_status(db: Session, iaq_data):
    global last_update_time

    # Get the current timestamp
    current_time = datetime.now()
    
    # Update last_update_time if iaq_data is received
    if iaq_data:
        last_update_time = current_time
        print(f"Timestamp: {current_time.strftime('%Y-%m-%d %H:%M:%S')}, IAQ Data: {iaq_data}")

    # Check the time since last update
    if last_update_time:
        time_difference = current_time - last_update_time
        
        # Determine message and status based on the time difference
        if time_difference <= timedelta(minutes=2):
            message = "Data received recently."
            status = True
        else:
            if time_difference <= timedelta(minutes=4):
                message = "No data received for the last 2 minutes."
            elif time_difference <= timedelta(minutes=10):
                message = "No data received for the last 4 minutes."
            else:
                message = "Device offline (no data received for the last 10 minutes)."
            status = False
    else:
        # If no data has ever been received
        message = "Device offline (no data received)."
        status = False

    # Return the status in a dictionary format
    return {
        "last_updated_time": last_update_time.strftime('%Y-%m-%d %H:%M:%S') if last_update_time else "N/A",
        "message": message,
        "status": status
    }




def Temp_data(db: Session, iaq_data):
    """Process the incoming payload to extract Temp and Hum values, calculate statistics, and save results."""
    
    # Extract Temp and Hum values from the incoming data
    Temp_value = iaq_data.get("Temp", 0)
    Hum_value = iaq_data.get("Hum", 0)
    print(f"Extracted Temp Value: {Temp_value}")
    print(f"Extracted Hum Value: {Hum_value}")
    
    # Check if the Temp or Hum values are missing
    if Temp_value is None or Hum_value is None:
        print("Temp or Hum value not found in the payload.")
        return
    
    # Get the current timestamp and calculate the hour range
    current_time = datetime.now()
    start_date = current_time.replace(minute=0, second=0, microsecond=0)  # Start of the hour
    end_date = start_date + timedelta(hours=1) - timedelta(seconds=1)  # End of the hour

    # Check if a record already exists for the current hour
    existing_record = db.query(TempHourModel).filter(
        TempHourModel.start_date == start_date.strftime("%Y-%m-%d %H:%M:%S"),
        TempHourModel.end_date == end_date.strftime("%Y-%m-%d %H:%M:%S")
    ).first()

    # Use separate lists to keep track of Temp and Hum values for the hour
    Temp_values = []  # List to store Temp values
    Hum_values = []  # List to store Hum values

    # Add the current Temp and Hum values to their respective lists
    Temp_values.append(Temp_value)
    Hum_values.append(Hum_value)

    # Compute the sum and count of Temp values
    Temp_count = len(Temp_values)
    Temp_sum = sum(Temp_values)
    mean_Temp = round(Temp_sum / Temp_count, 2) if Temp_count > 0 else 0.0

    # Compute the sum and count of Hum values
    Hum_count = len(Hum_values)
    Hum_sum = sum(Hum_values)
    mean_Hum = round(Hum_sum / Hum_count, 2) if Hum_count > 0 else 0.0

    # Print the lists, counts, and mean values for Temp and Hum
    print(f"Temp List: {Temp_values}")
    print(f"Temp Count: {Temp_count}")
    print(f"Mean Temp: {mean_Temp:.2f} at {current_time}")
    
    print(f"Hum List: {Hum_values}")
    print(f"Hum Count: {Hum_count}")
    print(f"Mean Hum: {mean_Hum:.2f} at {current_time}")

    
    if existing_record:
        existing_record.Temp = str(mean_Temp)  
        existing_record.Hum = str(mean_Hum) 
        db.commit()
        print("Mean Temp and Hum updated in the TempHourModel.")
    else:
       
        aqi_record = TempHourModel(
            Temp=mean_Temp,
            Hum=mean_Hum,
            start_date=start_date.strftime("%Y-%m-%d %H:%M:%S"), 
            end_date=end_date.strftime("%Y-%m-%d %H:%M:%S")  
        )
        
        # Add the new record to the session
        db.add(aqi_record)
        
        # Commit the changes to the database
        db.commit()
        print("Mean Temp and Hum saved to the TempHourModel.")

