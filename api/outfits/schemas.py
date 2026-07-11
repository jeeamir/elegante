from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class OutfitRequest(BaseModel):
    profile_id: int
    occasion: str
    mood: Optional[str] = None


class OutfitItem(BaseModel):
    item: str
    color: str
    material: str
    size: str
    reason: str
    shops: List[str]


class OutfitResponse(BaseModel):
    top: OutfitItem
    bottom: OutfitItem
    shoes: OutfitItem
    accessory: OutfitItem


class OutfitHistoryResponse(BaseModel):
    id: int
    profile_id: int
    occasion: str
    mood: Optional[str] = None
    result: dict
    created_at: datetime

    class Config:
        from_attributes = True



class OutfitFeedback(BaseModel):
    overall_score: int
    color_match: str
    fit_assessment: str
    strengths: List[str]
    improvements: List[str]

class PhotoFeedbackResponse(BaseModel):
    id: int
    profile_id: int
    occasion: str
    feedback: dict
    created_at: datetime

    class Config:
        from_attributes = True
