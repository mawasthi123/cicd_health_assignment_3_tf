from sqlalchemy.orm import Session
from . import models, schemas
from datetime import datetime

def get_pipelines(db: Session):
    return db.query(models.Pipeline).all()

def get_builds(db: Session, pipeline_id: int = None):
    if pipeline_id:
        return db.query(models.Build).filter(models.Build.pipeline_id == pipeline_id).all()
    return db.query(models.Build).all()

def get_build(db: Session, build_id: int):
    return db.query(models.Build).filter(models.Build.id == build_id).first()

def create_build(db: Session, build: schemas.BuildBase, pipeline_id: int):
    db_build = models.Build(**build.dict(), pipeline_id=pipeline_id)
    db.add(db_build)
    db.commit()
    db.refresh(db_build)
    return db_build

def create_alert(db: Session, alert: schemas.AlertBase, build_id: int):
    db_alert = models.Alert(**alert.dict(), build_id=build_id)
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)
    return db_alert