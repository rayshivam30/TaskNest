from fastapi import Depends, APIRouter, HTTPException
from sqlalchemy.orm import Session
from app import schemas, crud
from app.database import SessionLocal
from app.auth.routes import get_current_user, get_db
from app.models import User

router = APIRouter()

@router.get("/")
def read_tasks(db: Session = Depends(get_db), 
               current_user: User = Depends(get_current_user)):
    return crud.get_tasks(db, user_id=current_user.id)

@router.post("/")
def create_task(task: schemas.TaskCreate, 
                db: Session = Depends(get_db), 
                current_user: User = Depends(get_current_user)):
    return crud.create_task(db, task, user_id=current_user.id)


