from datetime import date
from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from enum import Enum

class PriorityEnum(str, Enum):
    high = "high"
    medium = "medium"
    low = "low"
    completed = "Completed"

class TaskBase(BaseModel):
    title: Optional[str]
    description: Optional[str]
    priority: Optional[PriorityEnum] ="Low"
    due_date: Optional[date] = None
    completed: Optional[bool] 

    @validator("due_date")
    def validate_due_date(cls, v):
        if v and v <= date.today():
            raise ValueError("Due date must be in future")
        return v

class TaskCreate(BaseModel):
    title: str
    description: Optional[str]
    due_date: Optional[date]
    priority: Optional[str]

class Task(TaskBase):
    id : int
    owner_id : int
    class Config:
        orm_mode = True

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class User(BaseModel):
    id : int
    email : EmailStr
    username : str
    class Config:
        orm_mode = True

class TaskUpdate(BaseModel):
    title: Optional[str]
    description: Optional[str]
    priority: Optional[PriorityEnum]
    due_date: Optional[date]
    completed: Optional[bool]

class UserOut(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        orm_mode = True