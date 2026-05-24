from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional


# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ.get('JWT_SECRET', 'change-me-in-production')
JWT_ALGORITHM = "HS256"
JWT_EXPIRY_HOURS = 24

# Create the main app without a prefix
app = FastAPI(title="Laboratory for Multiscale Innovative Technologies API")

# Configure CORS
origins = os.environ.get("CORS_ORIGINS", "").split(",")
if not origins or origins == [""]:
    origins = ["*"] # Fallback to allow all if not specified

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")
admin_router = APIRouter(prefix="/api/admin")


# ============================================
# Auth Helpers
# ============================================

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRY_HOURS),
        "type": "access"
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_admin(request: Request) -> dict:
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = auth_header[7:]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
        if not user or user.get("role") != "admin":
            raise HTTPException(status_code=401, detail="Not authorized")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ============================================
# Pydantic Models
# ============================================

DEFAULT_HERO_BACKGROUND = "https://images.unsplash.com/photo-1576141546153-3e04370b5ff7"


class LabInfo(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: str
    tagline: str
    description: str
    email: str
    phone: str
    address: str
    hero_background_image: str = DEFAULT_HERO_BACKGROUND
    logo_image: str = ""


class ResearchFocus(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: int
    title: str
    description: str
    image: str
    keywords: List[str]


class ResearchFocusInput(BaseModel):
    title: str
    description: str
    image: str
    keywords: List[str]


class Publication(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: int
    title: str
    authors: str
    year: int
    journal: str
    doi: str
    pdf: str


class PublicationInput(BaseModel):
    title: str
    authors: str
    year: int
    journal: str
    doi: str
    pdf: str = "#"


class LabMember(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: int
    name: str
    title: str
    image: str
    bio: str
    research: List[str]
    email: str
    linkedin: str
    scholar: str
    cv_url: str = ""
    is_alumni: bool = False
    current_workplace: str = ""
    sort_order: int = 0


class LabMemberInput(BaseModel):
    name: str
    title: str
    image: str
    bio: str
    research: List[str]
    email: str
    linkedin: str = "#"
    scholar: str = "#"
    cv_url: str = ""
    is_alumni: bool = False
    current_workplace: str = ""
    sort_order: int = 0

class LabMemberReorderInput(BaseModel):
    member_ids: List[int]

class YoutubeVideo(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: int
    title: str
    description: str = ""
    youtube_url: str
    sort_order: int = 0


class YoutubeVideoInput(BaseModel):
    title: str
    description: str = ""
    youtube_url: str
    sort_order: int = 0


class NewsItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: int
    title: str
    date: str
    excerpt: str
    image: str


class NewsInput(BaseModel):
    title: str
    date: str
    excerpt: str
    image: str


class ContactSubmission(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    subject: str = Field(..., min_length=1, max_length=200)
    message: str = Field(..., min_length=1, max_length=5000)


class ContactSubmissionRecord(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    email: str
    subject: str
    message: str
    submitted_at: str


class ContactResponse(BaseModel):
    success: bool
    message: str
    submission_id: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


# ============================================
# Helper - get next ID
# ============================================

async def get_next_id(collection_name: str) -> int:
    last = await db[collection_name].find_one({}, sort=[("id", -1)], projection={"_id": 0, "id": 1})
    return (last["id"] + 1) if last else 1


# ============================================
# Public Routes
# ============================================

@api_router.get("/")
async def root():
    return {"message": "Laboratory for Multiscale Innovative Technologies API", "status": "running"}


@api_router.get("/lab-info", response_model=LabInfo)
async def get_lab_info():
    info = await db.lab_info.find_one({}, {"_id": 0})
    if not info:
        raise HTTPException(status_code=404, detail="Lab information not found")
    info.setdefault("hero_background_image", DEFAULT_HERO_BACKGROUND)
    return info


@api_router.get("/research-focus", response_model=List[ResearchFocus])
async def get_research_focus():
    items = await db.research_focus.find({}, {"_id": 0}).sort("id", 1).to_list(100)
    return items


@api_router.get("/publications", response_model=List[Publication])
async def get_publications(limit: Optional[int] = None, year: Optional[int] = None):
    query = {}
    if year:
        query["year"] = year
    cursor = db.publications.find(query, {"_id": 0}).sort("year", -1)
    if limit:
        cursor = cursor.limit(limit)
    items = await cursor.to_list(1000)
    return items


@api_router.get("/lab-members", response_model=List[LabMember])
async def get_lab_members():
    items = await db.lab_members.find({}, {"_id": 0}).sort([("sort_order", 1), ("id", 1)]).to_list(100)
    for item in items:
        item.setdefault("cv_url", "")
        item.setdefault("is_alumni", False)
        item.setdefault("current_workplace", "")
        item.setdefault("sort_order", 0)
    return items


@api_router.get("/youtube-videos", response_model=List[YoutubeVideo])
async def get_youtube_videos():
    items = await db.youtube_videos.find({}, {"_id": 0}).sort([("sort_order", 1), ("id", 1)]).to_list(100)
    return items


@api_router.get("/news", response_model=List[NewsItem])
async def get_news(limit: Optional[int] = None):
    cursor = db.news.find({}, {"_id": 0}).sort([("date", -1), ("id", -1)])
    if limit:
        cursor = cursor.limit(limit)
    items = await cursor.to_list(100)
    return items


@api_router.post("/contact", response_model=ContactResponse)
async def submit_contact(submission: ContactSubmission):
    submission_id = str(uuid.uuid4())
    doc = {
        "id": submission_id,
        "name": submission.name,
        "email": submission.email,
        "subject": submission.subject,
        "message": submission.message,
        "submitted_at": datetime.now(timezone.utc).isoformat()
    }
    await db.contact_submissions.insert_one(doc)
    return ContactResponse(
        success=True,
        message="Message sent successfully! We will get back to you soon.",
        submission_id=submission_id
    )


# ============================================
# Auth Routes
# ============================================

@api_router.post("/auth/login", response_model=LoginResponse)
async def login(payload: LoginRequest):
    email = payload.email.lower()
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(user["id"], user["email"])
    return LoginResponse(
        access_token=token,
        user={"id": user["id"], "email": user["email"], "name": user["name"], "role": user["role"]}
    )


@api_router.get("/auth/me")
async def get_me(admin: dict = Depends(get_current_admin)):
    return admin


# ============================================
# Admin Routes - Lab Info
# ============================================

@admin_router.put("/lab-info", response_model=LabInfo)
async def update_lab_info(info: LabInfo, admin: dict = Depends(get_current_admin)):
    doc = info.model_dump()
    await db.lab_info.update_one({}, {"$set": doc}, upsert=True)
    return doc


# ============================================
# Admin Routes - Research Focus
# ============================================

@admin_router.post("/research-focus", response_model=ResearchFocus)
async def create_research_focus(item: ResearchFocusInput, admin: dict = Depends(get_current_admin)):
    new_id = await get_next_id("research_focus")
    doc = {"id": new_id, **item.model_dump()}
    await db.research_focus.insert_one(dict(doc))
    return {k: v for k, v in doc.items() if k != "_id"}


@admin_router.put("/research-focus/{item_id}", response_model=ResearchFocus)
async def update_research_focus(item_id: int, item: ResearchFocusInput, admin: dict = Depends(get_current_admin)):
    result = await db.research_focus.update_one({"id": item_id}, {"$set": item.model_dump()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Research focus not found")
    updated = await db.research_focus.find_one({"id": item_id}, {"_id": 0})
    return updated


@admin_router.delete("/research-focus/{item_id}")
async def delete_research_focus(item_id: int, admin: dict = Depends(get_current_admin)):
    result = await db.research_focus.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Research focus not found")
    return {"success": True}


# ============================================
# Admin Routes - Publications
# ============================================

@admin_router.post("/publications", response_model=Publication)
async def create_publication(item: PublicationInput, admin: dict = Depends(get_current_admin)):
    new_id = await get_next_id("publications")
    doc = {"id": new_id, **item.model_dump()}
    await db.publications.insert_one(dict(doc))
    return {k: v for k, v in doc.items() if k != "_id"}


@admin_router.put("/publications/{item_id}", response_model=Publication)
async def update_publication(item_id: int, item: PublicationInput, admin: dict = Depends(get_current_admin)):
    result = await db.publications.update_one({"id": item_id}, {"$set": item.model_dump()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Publication not found")
    updated = await db.publications.find_one({"id": item_id}, {"_id": 0})
    return updated


@admin_router.delete("/publications/{item_id}")
async def delete_publication(item_id: int, admin: dict = Depends(get_current_admin)):
    result = await db.publications.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Publication not found")
    return {"success": True}


# ============================================
# Admin Routes - Lab Members
# ============================================

@admin_router.post("/lab-members", response_model=LabMember)
async def create_lab_member(item: LabMemberInput, admin: dict = Depends(get_current_admin)):
    new_id = await get_next_id("lab_members")
    doc = {"id": new_id, **item.model_dump()}
    await db.lab_members.insert_one(dict(doc))
    return {k: v for k, v in doc.items() if k != "_id"}


@admin_router.put("/lab-members/{item_id}", response_model=LabMember)
async def update_lab_member(item_id: int, item: LabMemberInput, admin: dict = Depends(get_current_admin)):
    result = await db.lab_members.update_one({"id": item_id}, {"$set": item.model_dump()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Lab member not found")
    updated = await db.lab_members.find_one({"id": item_id}, {"_id": 0})
    return updated


@admin_router.put("/lab-members/reorder/bulk")
async def reorder_lab_members(payload: LabMemberReorderInput, admin: dict = Depends(get_current_admin)):
    for index, member_id in enumerate(payload.member_ids):
        await db.lab_members.update_one({"id": member_id}, {"$set": {"sort_order": index}})
    return {"success": True}


@admin_router.delete("/lab-members/{item_id}")
async def delete_lab_member(item_id: int, admin: dict = Depends(get_current_admin)):
    result = await db.lab_members.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lab member not found")
    return {"success": True}


# ============================================
# Admin Routes - News
# ============================================

@admin_router.post("/news", response_model=NewsItem)
async def create_news(item: NewsInput, admin: dict = Depends(get_current_admin)):
    new_id = await get_next_id("news")
    doc = {"id": new_id, **item.model_dump()}
    await db.news.insert_one(dict(doc))
    return {k: v for k, v in doc.items() if k != "_id"}


@admin_router.put("/news/{item_id}", response_model=NewsItem)
async def update_news(item_id: int, item: NewsInput, admin: dict = Depends(get_current_admin)):
    result = await db.news.update_one({"id": item_id}, {"$set": item.model_dump()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="News item not found")
    updated = await db.news.find_one({"id": item_id}, {"_id": 0})
    return updated


@admin_router.delete("/news/{item_id}")
async def delete_news(item_id: int, admin: dict = Depends(get_current_admin)):
    result = await db.news.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="News item not found")
    return {"success": True}


# ============================================
# Admin Routes - YouTube Videos
# ============================================

@admin_router.post("/youtube-videos", response_model=YoutubeVideo)
async def create_youtube_video(item: YoutubeVideoInput, admin: dict = Depends(get_current_admin)):
    new_id = await get_next_id("youtube_videos")
    doc = {"id": new_id, **item.model_dump()}
    await db.youtube_videos.insert_one(dict(doc))
    return {k: v for k, v in doc.items() if k != "_id"}


@admin_router.put("/youtube-videos/{item_id}", response_model=YoutubeVideo)
async def update_youtube_video(item_id: int, item: YoutubeVideoInput, admin: dict = Depends(get_current_admin)):
    result = await db.youtube_videos.update_one({"id": item_id}, {"$set": item.model_dump()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Video not found")
    updated = await db.youtube_videos.find_one({"id": item_id}, {"_id": 0})
    return updated


@admin_router.delete("/youtube-videos/{item_id}")
async def delete_youtube_video(item_id: int, admin: dict = Depends(get_current_admin)):
    result = await db.youtube_videos.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Video not found")
    return {"success": True}


# ============================================
# Admin Routes - Contact Submissions
# ============================================

@admin_router.get("/contact-submissions", response_model=List[ContactSubmissionRecord])
async def get_contact_submissions(admin: dict = Depends(get_current_admin)):
    items = await db.contact_submissions.find({}, {"_id": 0}).sort("submitted_at", -1).to_list(1000)
    return items


@admin_router.delete("/contact-submissions/{submission_id}")
async def delete_contact_submission(submission_id: str, admin: dict = Depends(get_current_admin)):
    result = await db.contact_submissions.delete_one({"id": submission_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Submission not found")
    return {"success": True}


# ============================================
# Startup - Admin Seeding & Indexes
# ============================================

@app.on_event("startup")
async def startup_event():
    # Create indexes
    await db.users.create_index("email", unique=True)

    # Backfill new fields on existing documents
    info = await db.lab_info.find_one({})
    if info and "hero_background_image" not in info:
        await db.lab_info.update_one(
            {},
            {"$set": {"hero_background_image": DEFAULT_HERO_BACKGROUND}},
        )
    await db.lab_members.update_many(
        {"cv_url": {"$exists": False}},
        {"$set": {"cv_url": ""}},
    )

    # Seed admin user
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@example.com").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")

    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        logging.info(f"Created admin user: {admin_email}")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}}
        )
        logging.info(f"Updated admin password for: {admin_email}")


# Include the routers in the main app
app.include_router(api_router)
app.include_router(admin_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
