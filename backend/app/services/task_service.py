from datetime import datetime, timezone
from typing import List, Dict, Any
from fastapi import HTTPException, status
from app.config.database import db_helper
from app.schemas.task_schema import TaskCreate, TaskUpdate
# pyrefly: ignore [missing-import]
from bson import ObjectId

# Format timestamp helper to output Node-compatible ISO string
def format_iso_timestamp(dt: datetime) -> str:
    # Mongoose output format: '2026-05-30T12:00:00.000Z'
    return dt.strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"

class TaskService:
    @staticmethod
    async def get_tasks(user_id: str) -> List[Dict[str, Any]]:
        # Fetch only tasks belonging to this user
        cursor = db_helper.db.tasks.find({"user": user_id})
        tasks = []
        async for doc in cursor:
            # Map fields for Pydantic/Frontend compatibility
            doc["_id"] = str(doc["_id"])
            doc["user"] = str(doc["user"])
            
            # Format custom timestamps
            doc["createdAt"] = format_iso_timestamp(doc.get("createdAt", datetime.now(timezone.utc)))
            doc["updatedAt"] = format_iso_timestamp(doc.get("updatedAt", datetime.now(timezone.utc)))
            tasks.append(doc)
        return tasks

    @staticmethod
    async def create_task(task_data: TaskCreate, user_id: str) -> Dict[str, Any]:
        now = datetime.now(timezone.utc)
        new_task = {
            "title": task_data.title,
            "description": task_data.description or "",
            "stage": task_data.stage.value,
            "user": user_id,
            "createdAt": now,
            "updatedAt": now
        }
        
        result = await db_helper.db.tasks.insert_one(new_task)
        new_task["_id"] = str(result.inserted_id)
        
        # Format timestamps for return response
        new_task["createdAt"] = format_iso_timestamp(new_task["createdAt"])
        new_task["updatedAt"] = format_iso_timestamp(new_task["updatedAt"])
        return new_task

    @staticmethod
    async def update_task(task_id: str, task_data: TaskUpdate, user_id: str) -> Dict[str, Any]:
        if not ObjectId.is_valid(task_id):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid Task ID format")
            
        # Verify ownership of this task
        existing_task = await db_helper.db.tasks.find_one({"_id": ObjectId(task_id), "user": user_id})
        if not existing_task:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
            
        # Prepare updates
        update_dict = {}
        if task_data.title is not None:
            update_dict["title"] = task_data.title
        if task_data.description is not None:
            update_dict["description"] = task_data.description
        if task_data.stage is not None:
            update_dict["stage"] = task_data.stage.value
            
        if not update_dict:
            # Nothing to update, return current formatted document
            existing_task["_id"] = str(existing_task["_id"])
            existing_task["user"] = str(existing_task["user"])
            existing_task["createdAt"] = format_iso_timestamp(existing_task["createdAt"])
            existing_task["updatedAt"] = format_iso_timestamp(existing_task["updatedAt"])
            return existing_task
            
        update_dict["updatedAt"] = datetime.now(timezone.utc)
        
        # Save updates to MongoDB
        await db_helper.db.tasks.update_one(
            {"_id": ObjectId(task_id)},
            {"$set": update_dict}
        )
        
        # Retrieve freshly updated document
        updated_doc = await db_helper.db.tasks.find_one({"_id": ObjectId(task_id)})
        updated_doc["_id"] = str(updated_doc["_id"])
        updated_doc["user"] = str(updated_doc["user"])
        updated_doc["createdAt"] = format_iso_timestamp(updated_doc["createdAt"])
        updated_doc["updatedAt"] = format_iso_timestamp(updated_doc["updatedAt"])
        return updated_doc

    @staticmethod
    async def delete_task(task_id: str, user_id: str) -> None:
        if not ObjectId.is_valid(task_id):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid Task ID format")
            
        # Verify ownership
        existing_task = await db_helper.db.tasks.find_one({"_id": ObjectId(task_id), "user": user_id})
        if not existing_task:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
            
        await db_helper.db.tasks.delete_one({"_id": ObjectId(task_id)})
