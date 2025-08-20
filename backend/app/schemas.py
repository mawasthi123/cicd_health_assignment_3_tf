from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class BuildBase(BaseModel):
    status: str
    duration: Optional[float]
    started_at: Optional[datetime]
    finished_at: Optional[datetime]
    logs: Optional[str]

class Build(BuildBase):
    id: int
    class Config:
        orm_mode = True

class PipelineBase(BaseModel):
    name: str
    provider: str
    repo: str

class Pipeline(PipelineBase):
    id: int
    builds: List[Build] = []
    class Config:
        orm_mode = True

class AlertBase(BaseModel):
    type: str
    status: str
    sent_at: Optional[datetime]

class Alert(AlertBase):
    id: int
    build_id: int
    class Config:
        orm_mode = True