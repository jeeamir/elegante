from fastapi import FastAPI, Depends, HTTPException
from schemas import UserProfile, OutfitRequest, OutfitHistoryResponse
from sqlalchemy.orm import Session
import models
from database import Base, engine, get_db
from ai_service import get_outfit_recommendation
from typing import List



def init_db():
    Base.metadata.create_all(bind=engine)

app = FastAPI(title="Elegante AI Stylist")


@app.on_event("startup")
async def startup():
    init_db()

@app.get("/")
async def root():
    return {"message": "Elegante API is running"}

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/profile")
async def create_profile(profile: UserProfile, db: Session = Depends(get_db)):
    new_profile = models.UserProfile(**profile.model_dump())
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    return new_profile

@app.post("/outfits", response_model=OutfitHistoryResponse)
async def get_outfit(request: OutfitRequest, db: Session = Depends(get_db)):
    profile = db.query(models.UserProfile).filter(models.UserProfile.id == request.profile_id).first()

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    result = get_outfit_recommendation(profile=profile, occasion=request.occasion, mood=request.mood)

    outfit_history = models.OutfitHistory(
        profile_id=request.profile_id,
        occasion=request.occasion,
        mood=request.mood,
        result=result,
    )

    db.add(outfit_history)
    db.commit()
    db.refresh(outfit_history)
    return outfit_history

@app.get("/profile/{profile_id}/history", response_model=List[OutfitHistoryResponse])
async def get_outfits(profile_id: int, db: Session = Depends(get_db)):
    history = db.query(models.OutfitHistory).filter(models.OutfitHistory.profile_id == profile_id).all()

    return history








