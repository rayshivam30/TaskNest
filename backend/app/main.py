from fastapi import FastAPI
from app.routes import tasks
from app.auth import routes as auth_routes
from app.database import Base, engine
from app import models

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(auth_routes.router, prefix="/auth", tags=["auth"])
app.include_router(tasks.router, prefix="/tasks", tags=["tasks"])