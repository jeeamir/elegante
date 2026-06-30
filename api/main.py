from fastapi import FastAPI, Depends, HTTPException
from schemas import UserProfile, OutfitRequest
from sqlalchemy.orm import Session
import models
from database import Base, engine, get_db
from ai_service import get_outfit_recommendation



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

@app.post("/outfits")
async def get_outfit(request: OutfitRequest, db: Session = Depends(get_db)):
    profile = db.query(models.UserProfile).filter(models.UserProfile.id == request.profile_id).first()

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    return get_outfit_recommendation(profile=profile, occasion=request.occasion, mood=request.mood)





