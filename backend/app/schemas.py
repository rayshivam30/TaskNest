from datetime import date
from pydantic import BaseModel, EmailStr
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
    title: str
    description: str