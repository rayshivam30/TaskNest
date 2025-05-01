from pydantic import BaseModel
from typing import Optional

class TaskBase(BaseModel):
    title: str
    description: str
    completed: bool=False

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

class user(BaseModel):
    id : int
    username : str
    class Config:
        orm_mode = True