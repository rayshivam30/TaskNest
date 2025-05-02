from datetime import date
from pydantic import BaseModel
from typing import Optional

class TaskBase(BaseModel):
    title: str
    description: str

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id : int
    owner_id : int
    class Config:
        orm_mode = True

class UserCreate(BaseModel):
    username: str
    password: str

class User(BaseModel):
    id : int
    username : str
    class Config:
        orm_mode = True

class TaskUpdate(BaseModel):
    title: str
    description: str