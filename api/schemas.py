from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum

class Currency(str, Enum):
    KZT = "KZT"
    EUR = "EUR"
    USD = "USD"

class ShoeSizeSystem(str, Enum):
    EU = "EU"
    US = "US"
    UK = "UK"

class WeightUnit(str, Enum):
    KG = "KG"
    LB = "lb"

class HeightUnit(str, Enum):
    CM = "cm"
    FT_IN = "ft_in"

class UserProfile(BaseModel):
    name: str = Field(min_length=2, max_length=50)
    gender: str
    weight: int = Field(gt=0, lt=300)
    height: int = Field(gt=0, lt=300)
    weight_unit: WeightUnit
    height_unit: HeightUnit
    shoe_size: float
    shoe_size_system: ShoeSizeSystem
    body_type: str
    lifestyle: str
    budget: float
    currency: Currency
    preferred_style: str
    favourite_shops: List[str]
    favourite_colors: List[str]


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







