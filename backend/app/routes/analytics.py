from fastapi import APIRouter, Query
from typing import List, Dict, Any
from app.models.schemas import ImpactMetrics, FrictionEvent
from app.database.db import db

router = APIRouter(prefix="", tags=["History & Analytics"])

@router.get("/history")
def get_history():
    return db.list_journeys()

@router.get("/search")
def global_search(query: str = Query("")):
    q = query.lower()
    journeys = [j for j in db.list_journeys() if q in j.title.lower() or q in j.user_input.lower()]
    services = [s for s in db.services if q in s["name"].lower() or q in s["description"].lower()]
    return {
        "journeys": journeys,
        "services": services
    }

@router.get("/analytics/friction")
def get_friction_analytics():
    return {
        "most_missing_document": "Hospital Birth Reporting Form 1 / Official Medical Slip",
        "most_blocked_task": "Maternity Benefit Scheme Application",
        "most_requested_clarification": "Child birth order eligibility threshold",
        "total_friction_events": len(db.friction_events) + 14,
        "impact_metrics": db.get_impact_metrics()
    }

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "LIFE-EVENT CONCIERGE API",
        "demo_mode": True,
        "version": "1.0.0"
    }
