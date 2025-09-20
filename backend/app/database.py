from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .models import Base
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./cicd_dashboard.db")

engine_kwargs = {}
if DATABASE_URL.startswith("sqlite"):
    engine_kwargs["connect_args"] = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, **engine_kwargs)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
Base.metadata.create_all(bind=engine)