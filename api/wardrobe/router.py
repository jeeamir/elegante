from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from .schemas import WardrobeItemAnalysis, WardrobeAnalysisResponse, WardrobeItemResponse
from sqlalchemy.orm import Session
from database import get_db
from .ai_service import get_wardrobe_analysis
from outfits.ai_service import encode_image
from typing import List
from profiles import models as profile_models
from wardrobe import models as wardrobe_models


router = APIRouter(prefix="/wardrobe", tags=["wardrobe"])

@router.post("/analyze-photo", response_model=List[WardrobeItemResponse])
async def analyze_photo(profile_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):

    profile = db.query(profile_models.UserProfile).filter(profile_models.UserProfile.id == profile_id).first()

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    base64_image, media_type = await encode_image(file)

    result = get_wardrobe_analysis(base64_image=base64_image, media_type=media_type)

    wardrobe = []

    for item in result["items"]:
        wardrobe_item = wardrobe_models.WardrobeItem(profile_id=profile_id, **item)
        db.add(wardrobe_item)
        wardrobe.append(wardrobe_item)

    db.commit()

    for item in wardrobe:
        db.refresh(item)

    return wardrobe
