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
