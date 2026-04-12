import logging
import mimetypes
import os
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Literal, Optional

import requests
from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI, File, Form, HTTPException, UploadFile
from fastapi.responses import Response
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from starlette.middleware.cors import CORSMiddleware


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

PORTFOLIO_DOCUMENT_ID = "portfolio-main"
APP_STORAGE_PREFIX = "neon-portfolio-137"
STORAGE_URL = "https://integrations.emergentagent.com/objstore/api/v1/storage"
EMERGENT_KEY = os.environ.get("EMERGENT_LLM_KEY")
MAX_UPLOAD_BYTES = 40 * 1024 * 1024
storage_key = None

ALLOWED_CONTENT_TYPES = {
    "image/jpeg": "image",
    "image/png": "image",
    "image/webp": "image",
    "image/gif": "image",
    "video/mp4": "video",
    "video/webm": "video",
    "video/quicktime": "video",
    "application/pdf": "pdf",
}

app = FastAPI()
api_router = APIRouter(prefix="/api")


def utc_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class ProjectCategory(BaseModel):
    id: str
    label: str
    description: str


class MediaItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    type: Literal["image", "video", "pdf"]
    source: Literal["upload", "url"]
    url: str
    file_id: Optional[str] = None
    content_type: Optional[str] = None


class ProjectEntry(BaseModel):
    id: str
    title: str
    category_id: str
    summary: str
    role: str
    year: str
    outcome: str
    cover_image: str
    tools: List[str] = Field(default_factory=list)
    detail_points: List[str] = Field(default_factory=list)
    media_items: List[MediaItem] = Field(default_factory=list)
    featured: bool = False


class TimelineEntry(BaseModel):
    id: str
    title: str
    organization: str
    period: str
    description: str
    bullets: List[str] = Field(default_factory=list)


class EducationEntry(BaseModel):
    id: str
    program: str
    school: str
    period: str
    details: str


class LinkItem(BaseModel):
    id: str
    label: str
    url: str


class HeroContent(BaseModel):
    name: str
    title: str
    tagline: str
    status: str
    hero_image: str


class AboutContent(BaseModel):
    headline: str
    intro: str
    detail: str
    image_url: str
    specialties: List[str] = Field(default_factory=list)
    tools: List[str] = Field(default_factory=list)


class ResumeContent(BaseModel):
    summary: str
    pdf_url: str
    skills: List[str] = Field(default_factory=list)
    experience: List[TimelineEntry] = Field(default_factory=list)
    education: List[EducationEntry] = Field(default_factory=list)


class ContactContent(BaseModel):
    intro: str
    email: str
    location: str
    availability: str
    links: List[LinkItem] = Field(default_factory=list)


class PortfolioContent(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default=PORTFOLIO_DOCUMENT_ID)
    hero: HeroContent
    about: AboutContent
    project_categories: List[ProjectCategory] = Field(default_factory=list)
    projects: List[ProjectEntry] = Field(default_factory=list)
    resume: ResumeContent
    contact: ContactContent
    updated_at: str = Field(default_factory=utc_iso)


class ContactMessageCreate(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    project_interest: str = Field(min_length=2, max_length=120)
    message: str = Field(min_length=10, max_length=2000)


class ContactMessage(ContactMessageCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=utc_iso)


class UploadedFileRecord(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    project_id: str
    storage_path: str
    original_filename: str
    content_type: str
    media_type: Literal["image", "video", "pdf"]
    size: int
    is_deleted: bool = False
    created_at: str = Field(default_factory=utc_iso)


class MediaUploadResponse(BaseModel):
    id: str
    project_id: str
    original_filename: str
    content_type: str
    media_type: Literal["image", "video", "pdf"]
    size: int
    url: str


def init_storage() -> str:
    global storage_key

    if storage_key:
        return storage_key

    if not EMERGENT_KEY:
        raise RuntimeError("EMERGENT_LLM_KEY is not configured")

    response = requests.post(
        f"{STORAGE_URL}/init",
        json={"emergent_key": EMERGENT_KEY},
        timeout=30,
    )
    response.raise_for_status()
    storage_key = response.json()["storage_key"]
    return storage_key


def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    response = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data,
        timeout=120,
    )
    response.raise_for_status()
    return response.json()


def get_object(path: str) -> tuple[bytes, str]:
    key = init_storage()
    response = requests.get(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key},
        timeout=60,
    )
    response.raise_for_status()
    return response.content, response.headers.get("Content-Type", "application/octet-stream")


def detect_media_type(filename: str, content_type: Optional[str]) -> tuple[str, str, str]:
    normalized_content_type = (content_type or "").lower()
    guessed_content_type, _ = mimetypes.guess_type(filename)

    if normalized_content_type in ALLOWED_CONTENT_TYPES:
        media_type = ALLOWED_CONTENT_TYPES[normalized_content_type]
        resolved_content_type = normalized_content_type
    elif guessed_content_type in ALLOWED_CONTENT_TYPES:
        media_type = ALLOWED_CONTENT_TYPES[guessed_content_type]
        resolved_content_type = guessed_content_type
    else:
        raise HTTPException(
            status_code=400,
            detail="Only image, video, and PDF uploads are supported.",
        )

    extension = Path(filename).suffix.lower().lstrip(".")
    if not extension:
        extension = mimetypes.guess_extension(resolved_content_type) or ".bin"
        extension = extension.lstrip(".")

    return media_type, resolved_content_type, extension


def build_upload_url(file_id: str) -> str:
    return f"/api/uploads/{file_id}/content"


def default_portfolio() -> PortfolioContent:
    return PortfolioContent(
        hero=HeroContent(
            name="Your Name",
            title="Game Designer • Systems Thinker • Worldbuilder",
            tagline="I design readable spaces, high-stakes encounters, and player-first mechanics for neon-soaked worlds.",
            status="Open to internships, collaborations, and junior game design roles.",
            hero_image="https://images.pexels.com/photos/5845255/pexels-photo-5845255.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        ),
        about=AboutContent(
            headline="Designing memorable play through clarity, tension, and player choice.",
            intro="I am a game design student focused on systems, level flow, and the tiny interactions that make a world feel alive.",
            detail="Use the Studio page to swap every line, link, category, and project card with your own material. The structure is already organized so you can plug content in without guessing where it belongs.",
            image_url="https://images.pexels.com/photos/6489046/pexels-photo-6489046.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
            specialties=[
                "Level design for guided exploration",
                "Combat encounter pacing",
                "Quest and progression beats",
                "Playtesting and iteration",
            ],
            tools=["Unreal Engine", "Unity", "Figma", "Miro", "Photoshop", "Excel"],
        ),
        project_categories=[
            ProjectCategory(
                id="level-design",
                label="Level Design",
                description="Spaces built for readability, atmosphere, and tactical decision-making.",
            ),
            ProjectCategory(
                id="systems-design",
                label="Systems Design",
                description="Rules, loops, and tuning that shape player behavior over time.",
            ),
            ProjectCategory(
                id="narrative-design",
                label="Narrative Design",
                description="Story structure, mission beats, and environmental storytelling.",
            ),
        ],
        projects=[
            ProjectEntry(
                id="neon-heist",
                title="Neon Heist",
                category_id="level-design",
                summary="A stealth-action student prototype focused on vertical infiltration and readable enemy routing.",
                role="Level Designer",
                year="2026",
                outcome="Built a layered infiltration route with three viable paths and strong visual signposting.",
                cover_image="https://images.pexels.com/photos/7688549/pexels-photo-7688549.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                tools=["Unreal Engine 5", "Blockout", "Blueprints"],
                detail_points=[
                    "Designed a mission loop around surveillance, distraction, and escape.",
                    "Iterated on player readability after peer playtests.",
                    "Documented key beats with top-down maps and callouts.",
                ],
                media_items=[],
                featured=True,
            ),
            ProjectEntry(
                id="chrome-loop",
                title="Chrome Loop",
                category_id="systems-design",
                summary="A roguelite progression concept balancing risk, upgrades, and time pressure.",
                role="Systems Designer",
                year="2025",
                outcome="Shaped a reward economy that encouraged aggressive play without overwhelming new players.",
                cover_image="https://images.pexels.com/photos/159393/gamepad-video-game-controller-game-controller-controller-159393.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                tools=["Sheets", "Machinations", "Unity"],
                detail_points=[
                    "Mapped core loops and progression sinks.",
                    "Created balancing tables for enemy scaling and reward pacing.",
                    "Ran tuning passes based on session feedback.",
                ],
                media_items=[],
                featured=False,
            ),
            ProjectEntry(
                id="signal-zero",
                title="Signal Zero",
                category_id="narrative-design",
                summary="A branching cyberpunk story prototype driven by social infiltration and faction trust.",
                role="Narrative Designer",
                year="2025",
                outcome="Built mission dialogue with clear consequence tracking and environmental story hooks.",
                cover_image="https://images.unsplash.com/photo-1641650265007-b2db704cd9f3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzN8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBjaXR5JTIwbmVvbnxlbnwwfHx8fDE3NzU3ODc1MTh8MA&ixlib=rb-4.1.0&q=85",
                tools=["Twine", "Miro", "Google Docs"],
                detail_points=[
                    "Outlined faction goals and player-facing choice points.",
                    "Wrote branching scenes for trust gain and loss.",
                    "Used environmental clues to foreshadow mission twists.",
                ],
                media_items=[],
                featured=False,
            ),
        ],
        resume=ResumeContent(
            summary="I combine design documentation, greyboxing, system tuning, and playtest-driven iteration to create game experiences that feel legible, tense, and rewarding.",
            pdf_url="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            skills=[
                "Level greyboxing",
                "Encounter design",
                "Gameplay documentation",
                "Balance tuning",
                "Player onboarding",
                "Narrative structure",
            ],
            experience=[
                TimelineEntry(
                    id="student-project-lead",
                    title="Student Project Lead",
                    organization="University Capstone Team",
                    period="2025 – Present",
                    description="Led cross-discipline collaboration across design, art, and engineering for a cyberpunk action prototype.",
                    bullets=[
                        "Defined milestone goals and gameplay pillars.",
                        "Directed playtest capture and issue prioritization.",
                        "Maintained design docs and presentation decks.",
                    ],
                ),
                TimelineEntry(
                    id="level-design-collaborator",
                    title="Level Design Collaborator",
                    organization="Game Jam + Coursework Projects",
                    period="2024 – 2025",
                    description="Designed compact playable spaces with strong route readability and encounter pacing.",
                    bullets=[
                        "Built blockouts for small-team prototypes.",
                        "Adjusted layouts based on heatmaps and player notes.",
                        "Supported teammates with references and combat flow planning.",
                    ],
                ),
            ],
            education=[
                EducationEntry(
                    id="game-design-degree",
                    program="B.A. / B.S. in Game Design",
                    school="Your University",
                    period="Expected 2026",
                    details="Replace this with your degree program, graduation timeline, honors, and notable coursework.",
                )
            ],
        ),
        contact=ContactContent(
            intro="If you are looking for someone who loves player empathy, encounter pacing, and cyberpunk worldbuilding, let’s talk.",
            email="yourname@email.com",
            location="Your City, Your Country",
            availability="Available for internships, freelance collaboration, and playtest support.",
            links=[
                LinkItem(id="linkedin", label="LinkedIn", url="https://www.linkedin.com/"),
                LinkItem(id="itch", label="itch.io", url="https://itch.io/"),
                LinkItem(id="github", label="GitHub", url="https://github.com/"),
            ],
        ),
    )


async def get_or_seed_portfolio() -> dict:
    portfolio = await db.portfolio_content.find_one({"id": PORTFOLIO_DOCUMENT_ID}, {"_id": 0})
    if portfolio:
        return portfolio

    seeded_portfolio = default_portfolio().model_dump(mode="json")
    await db.portfolio_content.insert_one(seeded_portfolio.copy())
    return seeded_portfolio


@api_router.get("/")
async def root():
    return {"message": "Neon portfolio API online"}


@api_router.get("/portfolio", response_model=PortfolioContent)
async def get_portfolio():
    portfolio = await get_or_seed_portfolio()
    return portfolio


@api_router.put("/portfolio", response_model=PortfolioContent)
async def update_portfolio(payload: PortfolioContent):
    portfolio_dict = payload.model_dump(mode="json")
    portfolio_dict["id"] = PORTFOLIO_DOCUMENT_ID
    portfolio_dict["updated_at"] = utc_iso()

    await db.portfolio_content.replace_one(
        {"id": PORTFOLIO_DOCUMENT_ID},
        portfolio_dict,
        upsert=True,
    )

    updated_portfolio = await db.portfolio_content.find_one({"id": PORTFOLIO_DOCUMENT_ID}, {"_id": 0})
    return updated_portfolio


@api_router.post("/contact", response_model=ContactMessage)
async def submit_contact_message(payload: ContactMessageCreate):
    message = ContactMessage(**payload.model_dump())
    message_dict = message.model_dump(mode="json")

    await db.contact_messages.insert_one(message_dict.copy())
    return message


@api_router.get("/contact-messages", response_model=List[ContactMessage])
async def get_contact_messages():
    messages = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return messages


@api_router.post("/uploads", response_model=MediaUploadResponse)
async def upload_project_media(
    project_id: str = Form(...),
    file: UploadFile = File(...),
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="A file is required.")

    data = await file.read()
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="File exceeds the 40MB upload limit.")

    media_type, resolved_content_type, extension = detect_media_type(
        file.filename,
        file.content_type,
    )

    file_record = UploadedFileRecord(
        project_id=project_id,
        storage_path="",
        original_filename=file.filename,
        content_type=resolved_content_type,
        media_type=media_type,
        size=len(data),
    )
    storage_path = f"{APP_STORAGE_PREFIX}/uploads/{project_id}/{file_record.id}.{extension}"

    try:
        upload_result = put_object(storage_path, data, resolved_content_type)
    except Exception as error:
        logger.exception("Storage upload failed: %s", error)
        raise HTTPException(status_code=502, detail="Media upload failed.") from error

    file_record.storage_path = upload_result["path"]
    file_record.size = upload_result.get("size", len(data))

    await db.uploaded_files.insert_one(file_record.model_dump(mode="json").copy())

    return MediaUploadResponse(
        id=file_record.id,
        project_id=project_id,
        original_filename=file_record.original_filename,
        content_type=file_record.content_type,
        media_type=file_record.media_type,
        size=file_record.size,
        url=build_upload_url(file_record.id),
    )


@api_router.get("/uploads/{file_id}/content")
async def serve_uploaded_media(file_id: str):
    file_record = await db.uploaded_files.find_one(
        {"id": file_id, "is_deleted": False},
        {"_id": 0},
    )
    if not file_record:
        raise HTTPException(status_code=404, detail="File not found.")

    try:
        file_bytes, content_type = get_object(file_record["storage_path"])
    except Exception as error:
        logger.exception("Storage download failed: %s", error)
        raise HTTPException(status_code=502, detail="Media download failed.") from error

    return Response(
        content=file_bytes,
        media_type=file_record.get("content_type", content_type),
        headers={
            "Content-Disposition": f'inline; filename="{file_record["original_filename"]}"'
        },
    )


@api_router.delete("/uploads/{file_id}")
async def soft_delete_uploaded_media(file_id: str):
    result = await db.uploaded_files.update_one(
        {"id": file_id},
        {"$set": {"is_deleted": True}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="File not found.")

    return {"success": True}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ["CORS_ORIGINS"].split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def startup_seed_content():
    await db.portfolio_content.create_index("id", unique=True)
    await db.contact_messages.create_index("id", unique=True)
    await db.uploaded_files.create_index("id", unique=True)
    await db.uploaded_files.create_index("storage_path", unique=True)
    await get_or_seed_portfolio()

    if EMERGENT_KEY:
        try:
            init_storage()
            logger.info("Object storage ready")
        except Exception as error:
            logger.error("Object storage init failed: %s", error)

    logger.info("Portfolio content ready")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()