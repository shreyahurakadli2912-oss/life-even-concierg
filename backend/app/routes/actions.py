from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from app.models.schemas import AgentAction, ActionStatus
from app.agents.action_center import action_center_agent
from app.agents.monitoring import monitoring_agent
from app.database.db import db

router = APIRouter(prefix="/actions", tags=["Human-in-the-Loop Actions"])

@router.post("/create", response_model=AgentAction)
def create_action(req: Dict[str, Any]):
    journey_id = req.get("journey_id", "demo_jrn")
    title = req.get("title", "Prepare Application Checklist")
    description = req.get("description", "Generate application packet for civil service submission")
    reason = req.get("reason", "All required context information is collected.")
    target_task_id = req.get("target_task_id", "task_cb_1")
    service_id = req.get("service_id")

    action = action_center_agent.create_action(journey_id, title, description, reason, target_task_id, service_id)
    return db.save_action(action)

@router.post("/{id}/approve", response_model=AgentAction)
def approve_action(id: str):
    action = db.get_action(id)
    if not action:
        # Create ad-hoc action if not in DB
        action = action_center_agent.create_action("demo_jrn", "Approved Action", "Simulated approval", "User initiated", "task_cb_1")
        action.action_id = id
        
    action.status = ActionStatus.APPROVED
    db.save_action(action)
    
    # Automatically trigger execution after approval
    simulated_action = action_center_agent.execute_simulated_action(action)
    db.save_action(simulated_action)

    # Update journey state if journey exists
    journey = db.get_journey(simulated_action.journey_id)
    if journey:
        target_task = simulated_action.required_info.get("target_task_id", "")
        updated_journey = monitoring_agent.process_action_result(journey, target_task, simulated_action.title)
        db.save_journey(updated_journey)

    return simulated_action

@router.post("/{id}/execute", response_model=AgentAction)
def execute_action(id: str):
    action = db.get_action(id)
    if not action:
        raise HTTPException(status_code=404, detail="Action not found")
    simulated_action = action_center_agent.execute_simulated_action(action)
    return db.save_action(simulated_action)

@router.get("/{id}/status", response_model=AgentAction)
def get_action_status(id: str):
    action = db.get_action(id)
    if not action:
        raise HTTPException(status_code=404, detail="Action not found")
    return action
