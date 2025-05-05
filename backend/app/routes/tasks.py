from typing import List
from fastapi import Depends, APIRouter, HTTPException
from sqlalchemy.orm import Session
from app import schemas, crud
from app.database import SessionLocal
from app.auth.routes import get_current_user, get_db
from app.models import Task, User

router = APIRouter()

@router.get("/")
def read_tasks(db: Session = Depends(get_db), 
               current_user: User = Depends(get_current_user)):
    tasks = crud.get_tasks(db, user_id=current_user.id)
    return tasks

@router.post("/")
def create_task(task: schemas.TaskCreate, 
                db: Session = Depends(get_db), 
                current_user: User = Depends(get_current_user)):
    return crud.create_task(db, task, user_id=current_user.id)

@router.put("/{task_id}")
def update_task(
    task_id: int,
    task: schemas.TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_task = crud.get_task_by_id(db, task_id)
    if db_task is None or db_task.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Task not found")

    db_task.title = task.title
    db_task.description = task.description
    db_task.priority = task.priority
    db_task.due_date = task.due_date

    db.commit()
    db.refresh(db_task)
    return db_task


@router.delete("/{task_id}")
def delete_task(task_id: int,
                db: Session = Depends(get_db),
                current_user: User = Depends(get_current_user)):
    db_task = crud.get_task_by_id(db, task_id)
    if db_task is None or db_task.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Task not found")
    
    crud.delete_task(db, db_task)
    return {"message": "Task deleted successfully"}

@router.get("/users", response_model=List[schemas.UserOut])
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users
