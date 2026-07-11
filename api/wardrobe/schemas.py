from typing import List
from pydantic import BaseModel
from datetime import datetime

class WardrobeItemAnalysis(BaseModel):
    item: str
    color: str
    material: str
    fit: str
    category: str

class WardrobeItemResponse(BaseModel):
    id: int
    profile_id: int
    item: str
    color: str
    material: str
    fit: str
    category: str
    created_at: datetime

    class Config:
        from_attributes = True


class WardrobeAnalysisResponse(BaseModel):
    items: List[WardrobeItemAnalysis]











