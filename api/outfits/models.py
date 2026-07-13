from sqlalchemy import Column, Integer, String, Float, ARRAY, ForeignKey, DateTime, JSON, func
from database import Base

class OutfitHistory(Base):
    __tablename__ = "outfit_history"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id"), nullable=False)
    occasion = Column(String)
    mood = Column(String)
    result = Column(JSON)
    created_at = Column(DateTime, server_default=func.now())

class PhotoFeedback(Base):
    __tablename__ = "photo_feedback_history"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id"), nullable=False)
    occasion = Column(String)
    feedback = Column(JSON)
    created_at = Column(DateTime, server_default=func.now())
