### Backend using FastAPI

from fastapi import FastAPI

app = FastAPI()

app.include_router(auth_rouuters.router, prefix="/auth", tags=["auth"])
app.include_router(tasks.router, prefix="/tasks", tags=["tasks"])