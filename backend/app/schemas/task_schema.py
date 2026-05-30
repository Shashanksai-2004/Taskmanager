from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class TaskStage(str, Enum):
    TODO = "Todo"
    IN_PROGRESS = "In Progress"
    DONE = "Done"

class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=100, description="Title of the task")
    description: Optional[str] = Field("", description="Optional descriptive paragraph")
    stage: TaskStage = Field(TaskStage.TODO, description="Workflow stage")

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    stage: Optional[TaskStage] = None

class TaskResponse(BaseModel):
    id: str = Field(..., alias="_id")
    title: str
    description: str = ""
    stage: TaskStage
    user: str
    createdAt: str
    updatedAt: str

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "_id": "60d5ec4b1234567890abcdef",
                "title": "Design hero section",
                "description": "Create glassmorphic icons",
                "stage": "In Progress",
                "user": "60d5ec4b1234567890123456",
                "createdAt": "2026-05-30T12:00:00.000Z",
                "updatedAt": "2026-05-30T12:00:00.000Z"
            }
        }
