from fastapi import APIRouter, Depends, status
from typing import List
from app.schemas.task_schema import TaskResponse, TaskCreate, TaskUpdate
from app.services.task_service import TaskService
from app.middleware.auth_middleware import get_current_user

router = APIRouter()

@router.get("", response_model=List[TaskResponse], status_code=status.HTTP_200_OK)
async def get_all_tasks(current_user: dict = Depends(get_current_user)):
    user_id = current_user["_id"]
    return await TaskService.get_tasks(user_id)

@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_new_task(task_data: TaskCreate, current_user: dict = Depends(get_current_user)):
    user_id = current_user["_id"]
    return await TaskService.create_task(task_data, user_id)

@router.put("/{id}", response_model=TaskResponse, status_code=status.HTTP_200_OK)
async def update_existing_task(
    id: str, 
    task_data: TaskUpdate, 
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["_id"]
    return await TaskService.update_task(id, task_data, user_id)

@router.delete("/{id}", status_code=status.HTTP_200_OK)
async def delete_existing_task(id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user["_id"]
    await TaskService.delete_task(id, user_id)
    return {"message": "Task removed"}
