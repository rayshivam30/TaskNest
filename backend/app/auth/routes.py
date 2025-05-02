from fastapi import APIRouter, Depends, HTTPException 
from sqlalchemy.orm import Session 
from app import schemas, models, crud 
from app.database import SessionLocal 
from passlib.context import CryptContext 
from jose import JWTError, jwt 
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer

SECRET_KEY = "your-secret-key" 
ALGORITHM = "HS256" 
ACCESS_TOKEN_EXPIRE_MINUTES = 30 
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
Oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

router = APIRouter()

def get_db(): 
    db = SessionLocal() 
    try: 
        yield db 
    finally: 
        db.close()

def create_access_token(data: dict, expires_delta: timedelta): 
    to_encode = data.copy() 
    expire = datetime.utcnow() + expires_delta 
    to_encode.update({"exp": expire}) 
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(Oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = crud.get_user_by_username(db, username=username)
    if user is None:
        raise credentials_exception
    return user


@router.post("/signup") 
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    print("Received signup request for:", user.username)
    db_user = crud.get_user_by_username(db, user.username)
    if db_user:
        print("Username already exists")
        raise HTTPException(status_code=400, detail="Username already registered")
    created_user = crud.create_user(db, user)
    print("User created:", created_user.username)
    return created_user

@router.post("/login") 
def login(user: schemas.UserCreate, db: Session = Depends(get_db)): 
    db_user = crud.get_user_by_username(db, user.username) 
    if not db_user or not pwd_context.verify(user.password, db_user.hashed_password): 
        raise HTTPException(status_code=400, detail="Incorrect username or password") 
    access_token = create_access_token( 
        data={"sub": db_user.username}, 
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES) 
        ) 
    return {"access_token": access_token, "token_type": "bearer"}
