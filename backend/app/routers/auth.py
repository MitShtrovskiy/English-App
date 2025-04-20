from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from passlib.hash import bcrypt
from jose import jwt, JWTError
from datetime import datetime, timedelta
from app import models, schemas
from app.database import get_db
from fastapi.security import OAuth2PasswordBearer

SECRET_KEY = "secret"  # 🔐 Лучше вынести в .env
ALGORITHM = "HS256"

router = APIRouter(prefix="/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")  # 👈 подключаем схему авторизации


# ✅ Генерация токена
def create_access_token(data: dict, expires_delta: timedelta = timedelta(hours=24)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# ✅ Регистрация нового пользователя
@router.post("/register", response_model=schemas.Token)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if db.query(models.User).filter_by(email=user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = bcrypt.hash(user.password)

    db_user = models.User(
        email=user.email,
        hashed_password=hashed
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    token = create_access_token({"sub": str(db_user.id)})
    return {
        "access_token": token,
        "token_type": "bearer",
        "email": db_user.email
    }


# ✅ Авторизация
@router.post("/login", response_model=schemas.Token)
def login(data: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter_by(email=data.email).first()
    if not user or not bcrypt.verify(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": str(user.id)})
    return {
        "access_token": token,
        "token_type": "bearer",
        "email": user.email
    }


# ✅ Получение текущего пользователя из токена
@router.get("/me", response_model=schemas.UserOut)
def get_me(current_user: models.User = Depends(lambda: get_current_user())):
    return current_user


# ✅ Декодируем токен и находим пользователя
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Не удалось проверить учетные данные",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))  # 👈 ОБЯЗАТЕЛЬНО преобразуем в int
        if not user_id:
            raise credentials_exception
    except (JWTError, ValueError, TypeError):
        raise credentials_exception

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise credentials_exception
    return user