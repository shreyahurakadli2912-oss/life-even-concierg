import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException
from typing import List, Optional
from app.models.schemas import Journey, JourneyCreateRequest, TaskItem, TaskStatus, AgentActivity
from app.agents.planner import planner_agent
from app.agents.dependency_engine import dependency_engine
from app.agents.next_best_action import next_best_action_agent
from app.agents.monitoring import monitoring_agent
from app.database.db import db

router = APIRouter(prefix="/journey", tags=["Journeys"])

@router.post("/create", response_model=Journey)
def create_journey(req: JourneyCreateRequest):
    journey_id = f"jrn_{uuid.uuid4().hex[:8]}"
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    now_iso = datetime.now().isoformat()
    
    # Generate initial tasks from planner
    tasks = planner_agent.create_journey_tasks(req.event_type, req.context)
    
    # Evaluate dependencies
    updated_tasks, progress = dependency_engine.evaluate_graph(tasks)
    
    title_map = {
        "CHILD_BIRTH": "Newborn Child Birth Guided Journey",
        "DEATH_IN_FAMILY": "Family Member Demise Administrative Journey",
        "SENIOR_CITIZEN": "Senior Citizenship Concessions & Pension Journey"
    }
    
    activities = [
        AgentActivity(id="act_1", timestamp=now, agent_name="Life Event Classification Agent", message=f"Identified event '{req.event_type.value}'", status="COMPLETED"),
        AgentActivity(id="act_2", timestamp=now, agent_name="Context Collection Agent", message="Collected required context parameters", status="COMPLETED"),
        AgentActivity(id="act_3", timestamp=now, agent_name="Life Event Planner", message=f"Created {len(tasks)} dependency-aware tasks", status="COMPLETED"),
        AgentActivity(id="act_4", timestamp=now, agent_name="Dependency Engine", message="Evaluated initial task graph status", status="COMPLETED")
    ]
    
    next_action = next_best_action_agent.determine_next_action(updated_tasks, req.event_type.value)
    if next_action:
        activities.append(AgentActivity(
            id="act_5", timestamp=now, agent_name="Next Best Action Agent",
            message=f"Determined Next Best Action: '{next_action.action_title}'", status="READY"
        ))

    journey = Journey(
        id=journey_id,
        event_type=req.event_type,
        title=title_map.get(req.event_type.value, "Personalized Life Event Journey"),
        user_input=req.user_input,
        created_at=now_iso,
        updated_at=now_iso,
        context=req.context,
        progress_percentage=progress,
        tasks=updated_tasks,
        next_best_action=next_action,
        activities=activities
    )
    
    return db.save_journey(journey)

@router.get("/{id}", response_model=Journey)
def get_journey(id: str):
    journey = db.get_journey(id)
    if not journey:
        raise HTTPException(status_code=404, detail="Journey not found")
    return journey

@router.post("/{id}/next-action")
def get_next_action(id: str):
    journey = db.get_journey(id)
    if not journey:
        raise HTTPException(status_code=404, detail="Journey not found")
    next_action = next_best_action_agent.determine_next_action(journey.tasks, journey.event_type.value)
    journey.next_best_action = next_action
    db.save_journey(journey)
    return next_action

@router.post("/{id}/tasks/{task_id}/complete", response_model=Journey)
def complete_task(id: str, task_id: str):
    journey = db.get_journey(id)
    if not journey:
        raise HTTPException(status_code=404, detail="Journey not found")
    
    updated_journey = monitoring_agent.process_action_result(journey, task_id, "Manual Task Completion")
    return db.save_journey(updated_journey)
