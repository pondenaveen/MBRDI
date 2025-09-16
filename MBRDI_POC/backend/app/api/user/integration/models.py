from datetime import datetime
from sqlalchemy import Column, DateTime, String, Integer, ForeignKey,Date,Text
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.mysql import TINYINT
from app.database.base import Base, BaseModel


class IaqModel(Base, BaseModel):
    __tablename__ = "sdb_iaq"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    data = Column(Text, nullable=False)  
    location = Column(String(100), nullable=False)
    site = Column(String(100), nullable=False)
    building = Column(String(100), nullable=False)
    floor = Column(String(100), nullable=False)
    zone = Column(String(100), nullable=False) 

    def __repr__(self):
        return f"<FootfallModel (id={self.id}, data={self.data})>"
    

class RuleEngineModel(Base,BaseModel):
    __tablename__ = "sdb_rule_engine"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    kpi = Column(String(100), nullable=False)
    operator = Column(String(100), nullable=False)
    max_value = Column(String(100), nullable=False)
    min_value = Column(String(100), nullable=False)
    severity = Column(String(20), nullable=False)
    device = Column(String(100), nullable=False)

    def __repr__(self):
        return f"<FootfallModel (id={self.id}, data={self.data})>"
    

class AlertsModel(Base,BaseModel):
    __tablename__ = "sdb_alerts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    kpi = Column(String(100), nullable=False)
    Device = Column(String(100), nullable=False)
    value = Column(String(100), nullable=False)
    max_value = Column(String(100), nullable=False)
    min_value = Column(String(100), nullable=False)
    severity = Column(String(20), nullable=False)
    site = Column(String(100), nullable=False)
    building = Column(String(100), nullable=False)
    floor = Column(String(100), nullable=False)
    zone = Column(String(100), nullable=False)

    def __repr__(self):
        return f"<FootfallModel (id={self.id}, data={self.kpi})>"

class AQIHourModel(Base,BaseModel):
    __tablename__ = "sdb_aqi_hour"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    aqi = Column(String(100), nullable=False)
    start_date = Column(String(100),nullable=False)
    end_date = Column(String(100), nullable=False)    

class TempHourModel(Base,BaseModel):
    __tablename__ = "sdb_temp_hour"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    Temp = Column(String(100), nullable=False)
    Hum = Column(String(100), nullable=False)
    start_date = Column(String(100),nullable=False)
    end_date = Column(String(100), nullable=False) 



