from fastapi import APIRouter, Depends, HTTPException 
from sqlalchemy.orm import Session 
from app import schemas, crud, models 
from app.auth.routes import get_db

router = APIRouter()

#For simplicity, user ID is passed directly (ideally it should come from JWT)

@router.get("/") 
def read_tasks(user_id: int, db: Session = Depends(get_db)): 
    return crud.get_tasks(db, user_id)

@router.post("/") 
def create_task(task: schemas.TaskCreate, user_id: int, db: Session = Depends(get_db)): 
    return crud.create_task(db, task, user_id)

