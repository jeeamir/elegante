from fastapi import FastAPI
from database import Base, engine
from profiles.router import router as profiles_router
from outfits.router import router as outfits_router
from wardrobe.router import router as wardrobe_router
from profiles import models as profile_models
from outfits import models as outfit_models
from wardrobe import models as wardrobe_models

def init_db():
    Base.metadata.create_all(bind=engine)

app = FastAPI(title="Elegante AI Stylist")

@app.on_event("startup")
async def startup():
    init_db()

@app.get("/")
async def root():
    return {"message": "Elegante API is running"}

@app.get("/health")
async def health():
    return {"status": "ok"}

app.include_router(profiles_router)
app.include_router(outfits_router)
app.include_router(wardrobe_router)