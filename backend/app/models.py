from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import datetime

Base = declarative_base()

class Pipeline(Base):
    __tablename__ = "pipelines"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    provider = Column(String)
    repo = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    builds = relationship("Build", back_populates="pipeline")

class Build(Base):
    __tablename__ = "builds"
    id = Column(Integer, primary_key=True, index=True)
    pipeline_id = Column(Integer, ForeignKey("pipelines.id"))
    status = Column(String)
    duration = Column(Float)
    started_at = Column(DateTime)
    finished_at = Column(DateTime)
    logs = Column(String)
    pipeline = relationship("Pipeline", back_populates="builds")
    alerts = relationship("Alert", back_populates="build")

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    build_id = Column(Integer, ForeignKey("builds.id"))
    sent_at = Column(DateTime, default=datetime.datetime.utcnow)
    type = Column(String)
    status = Column(String)
    build = relationship("Build", back_populates="alerts")