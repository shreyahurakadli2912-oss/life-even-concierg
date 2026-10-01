from fastapi import APIRouter
from app.models.schemas import ClassificationRequest, ClassificationResponse, ContextCollectionRequest, ContextCollectionResponse
from app.agents.classifier import classification_agent
from app.agents.context_agent import context_agent

router = APIRouter(prefix="/events", tags=["Life Events"])

@router.post("/classify", response_model=ClassificationResponse)
def classify_event(payload: ClassificationRequest):
    return classification_agent.classify(payload.user_input)

@router.post("/context", response_model=ContextCollectionResponse)
def get_context_questions(payload: ContextCollectionRequest):
    return context_agent.get_questions(payload.event_type, payload.context_answers)
