from typing import List, Optional
from pydantic import BaseModel, Field


class UserProfile(BaseModel):
    name: str = Field(min_length=2, max_length=50)
    gender: str
    weight: int = Field(gt=0, lt=300)
    height: int = Field(gt=0, lt=300)
    body_type: str
    lifestyle: str
    budget: float
    preferred_style: str
    favourite_shops: List[str]
    favourite_colors: List[str]


class OutfitRequest(BaseModel):
    profile_id: int
    occasion: str
    mood: Optional[str] = None




