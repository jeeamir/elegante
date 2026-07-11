from fastapi import APIRouter, Depends, HTTPException

from .service import create_access_token, hash_password, verify_password
from .schemas import UserRegister, UserLogin, Token
from database import get_db
from sqlalchemy.orm import Session
from . import models as auth_models


router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
async def register(request: UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(auth_models.User).filter(auth_models.User.email == request.email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="User with this email is already registered")

    hashed_password = hash_password(request.password)

    new_user = auth_models.User(email=request.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token = create_access_token(data={"sub": new_user.email})

    return Token(access_token=access_token, token_type="bearer")


@router.post("/login")
async def login(request: UserLogin, db: Session = Depends(get_db)):
    user = db.query(auth_models.User).filter(auth_models.User.email == request.email).first()

    if not user:
        raise HTTPException(status_code=401, detail="User does not exist")

    check_password = verify_password(request.password, user.hashed_password)

    if not check_password:
        raise HTTPException(status_code=401, detail="Password is incorrect")

    access_token = create_access_token(data={"sub": user.email})

    return Token(access_token=access_token, token_type="bearer")


