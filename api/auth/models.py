from sqlalchemy import Column, Integer, String, Float, ARRAY, ForeignKey, DateTime, JSON, func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String)
    created_at = Column(DateTime, server_default=func.now())

