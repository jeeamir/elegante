from sqlalchemy import Column, Integer, String, Float, ARRAY, ForeignKey, DateTime, JSON, func
from database import Base


class UserProfile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    gender = Column(String, nullable=False)
    weight = Column(Integer)
    weight_unit = Column(String)
    height = Column(Integer)
    height_unit = Column(String)
    shoe_size = Column(Float)
    shoe_size_system = Column(String)
    currency = Column(String)
    body_type = Column(String, nullable=False)
    lifestyle = Column(String, nullable=False)
    budget = Column(Float)
    preferred_style = Column(String)
    favourite_shops = Column(ARRAY(String))
    favourite_colors = Column(ARRAY(String))



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














