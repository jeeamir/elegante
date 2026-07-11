from fastapi import APIRouter, Depends, HTTPException
from profiles.schemas import UserProfile
from sqlalchemy.orm import Session
from profiles import models
from database import get_db

router = APIRouter(prefix="/profile", tags=["profiles"])

@router.post("/")
async def create_profile(profile: UserProfile, db: Session = Depends(get_db)):
    new_profile = models.UserProfile(**profile.model_dump())
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    return new_profile