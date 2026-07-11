from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from .schemas import OutfitRequest, OutfitHistoryResponse, PhotoFeedbackResponse
from sqlalchemy.orm import Session
from database import get_db
from outfits import models as outfit_models
from profiles import models as profile_models
from .ai_service import encode_image, get_photo_feedback, get_outfit_recommendation
from typing import List

router = APIRouter(prefix="/outfits", tags=["outfits"])

@router.post("/", response_model=OutfitHistoryResponse)
async def get_outfit(request: OutfitRequest, db: Session = Depends(get_db)):
    profile = db.query(profile_models.UserProfile).filter(profile_models.UserProfile.id == request.profile_id).first()

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    result = get_outfit_recommendation(profile=profile, occasion=request.occasion, mood = request.mood)

    outfit_history = outfit_models.OutfitHistory(
        profile_id=request.profile_id,
        occasion=request.occasion,
        mood=request.mood,
        result=result
    )

    db.add(outfit_history)
    db.commit()
    db.refresh(outfit_history)
    return outfit_history


@router.post("/photo-feedback", response_model=PhotoFeedbackResponse)
async def photo_feedback(profile_id: int, occasion: str, file: UploadFile = File(...), db: Session = Depends(get_db)):

    profile = db.query(profile_models.UserProfile).filter(profile_models.UserProfile.id == profile_id).first()

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    base64_image, media_type = await encode_image(file)

    result = get_photo_feedback(profile=profile, occasion=occasion, base64_image=base64_image, media_type=media_type)

    feedback = outfit_models.PhotoFeedback(
        profile_id=profile_id,
        occasion=occasion,
        feedback=result
    )

    db.add(feedback)
    db.commit()
    db.refresh(feedback)

    return feedback


@router.get("/profile/{profile_id}/history", response_model=List[OutfitHistoryResponse])
async def get_outfits(profile_id: int, db: Session = Depends(get_db)):
    history = db.query(outfit_models.OutfitHistory).filter(outfit_models.OutfitHistory.profile_id == profile_id).all()
    return history

