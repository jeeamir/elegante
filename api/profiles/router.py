from fastapi import APIRouter, Depends, HTTPException
from profiles.schemas import UserProfile
from sqlalchemy.orm import Session
from profiles import models as profile_models
from database import get_db
from auth.service import get_current_user
from auth import models as auth_models

router = APIRouter(prefix="/profile", tags=["profiles"])

@router.post("/")
async def create_profile(profile: UserProfile, current_user: auth_models.User = Depends(get_current_user), db: Session = Depends(get_db)):

    existing_profile = db.query(profile_models.UserProfile).filter(profile_models.UserProfile.user_id == current_user.id).first()

    if existing_profile:
        raise HTTPException(status_code=409, detail="Profile already exist")

    new_profile = profile_models.UserProfile(**profile.model_dump(), user_id=current_user.id)
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    return new_profile