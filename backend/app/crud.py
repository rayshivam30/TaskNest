from sqlalchemy.orm import Session 
from app import models, schemas 
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_username(db: Session, username: str): 
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate): 
    hashed_password = pwd_context.hash(user.password) 
    db_user = models.User(username=user.username, hashed_password=hashed_password) 
    db.add(db_user) 
    db.commit() 
    db.refresh(db_user) 
    return db_user

def create_task(db: Session, task: schemas.TaskCreate, user_id: int): 
    db_task = models.Task(**task.dict(), owner_id=user_id) 
    db.add(db_task) 
    db.commit() 
    db.refresh(db_task) 
    return db_task

def get_tasks(db: Session, user_id: int): 
    return db.query(models.Task).filter(models.Task.owner_id == user_id).all()

def get_task_by_id(db: Session, task_id: int):
    return db.query(models.Task).filter(models.Task.id == task_id).first()

def update_task(db: Session, db_task: models.Task, task_update: schemas.TaskCreate):
    db_task.title = task_update.title
    db_task.description = task_update.description
    db_task.completed = task_update.completed
    db.commit()
    db.refresh(db_task)
    return db_task
