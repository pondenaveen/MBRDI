from datetime import datetime
from pydantic import BaseModel,Field
from typing import Optional,Union

class Alerts(BaseModel):
    kpi: str
    Device : str
    value : str
    site : str
    building : str
    floor : str
    zone : str
    created_at: datetime 
    class Config:
        orm_mode = True

class WeatherResponse(BaseModel):
    city: str
    temperature: str
    PM2_5: str 
    PM10: str
    class Config:
        orm_mode = True

class RuleConditonBase(BaseModel):
    kpi: str
    max_value: str
    min_value : str
    severity : str
    device: str
    operator: str
    

class RuleConditonCreate(RuleConditonBase):
    pass

class RuleConditonUpdate(RuleConditonBase):
    pass

class RuleConditon(RuleConditonBase):
    kpi: Optional[str]
    max_value : Optional[str]
    min_value : Optional[str]
    severity : Optional[str]
    device : Optional[str]
    operator : Optional[str]
    id: Optional[int]
    created_at: Optional[datetime]
    modified_at: Optional[datetime]
    updated_at: Optional[datetime] 

    class Config:
        orm_mode = True

