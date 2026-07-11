from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from database import Base

class WardrobeItem(Base):
    __tablename__ = "wardrobe_clothes"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id"), nullable=False)
    item = Column(String)
    color = Column(String)
    material = Column(String)
    fit = Column(String)
    category = Column(String)
    created_at = Column(DateTime, server_default=func.now())














