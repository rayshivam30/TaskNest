from fastapi import Depends, APIRouter, HTTPException, Path, Query
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

@router.put("/{task_id}")
def update_task(
    task_id: int,  # Non-default argument first
    task: schemas.TaskUpdate,  # Pydantic model argument for JSON body
    db: Session = Depends(get_db),  # Default arguments can come after
    current_user: User = Depends(get_current_user),
):
    # Fetch the existing task
    db_task = crud.get_task_by_id(db, task_id)
    if db_task is None or db_task.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Task not found")

    # Update the task fields with the data from the body
    db_task.title = task.title
    db_task.description = task.description
    db_task.due_date = task.due_date
    db_task.completed = task.completed

    db.commit()
    return db_task

