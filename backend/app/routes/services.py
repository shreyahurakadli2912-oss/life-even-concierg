from fastapi import APIRouter, Query
from typing import List, Optional, Dict, Any
from app.models.schemas import GovernmentService, EligibilityAssessment
from app.rag.knowledge import knowledge_engine
from app.agents.eligibility import eligibility_agent

router = APIRouter(prefix="", tags=["Services & Eligibility"])

@router.get("/services/search")
def search_services(query: str = Query(""), category: Optional[str] = None):
    return knowledge_engine.search_services(query, category)

@router.post("/eligibility/check", response_model=EligibilityAssessment)
def check_eligibility(req: Dict[str, Any]):
    service_id = req.get("service_id", "")
    context = req.get("context", {})
    documents = req.get("documents", [])
    return eligibility_agent.evaluate(service_id, context, documents)
