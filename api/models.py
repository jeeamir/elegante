from sqlalchemy import Column, Integer, String, Float, ARRAY
from database import Base


class UserProfile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    gender = Column(String, nullable=False)
    weight = Column(Integer)
    height = Column(Integer)
    body_type = Column(String, nullable=False)
    lifestyle = Column(String, nullable=False)
    budget = Column(Float)
    preferred_style = Column(String)
    favourite_shops = Column(ARRAY(String))
    favourite_colors = Column(ARRAY(String))













