from enum import Enum
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class EventType(str, Enum):
    CHILD_BIRTH = "CHILD_BIRTH"
    DEATH_IN_FAMILY = "DEATH_IN_FAMILY"
    SENIOR_CITIZEN = "SENIOR_CITIZEN"
    UNKNOWN = "UNKNOWN"

class TaskStatus(str, Enum):
    LOCKED = "LOCKED"
    READY = "READY"
    IN_PROGRESS = "IN_PROGRESS"
    NEEDS_REVIEW = "NEEDS_REVIEW"
    COMPLETED = "COMPLETED"
    BLOCKED = "BLOCKED"

class CertaintyLevel(str, Enum):
    FACT = "FACT"
    PROBABLE = "PROBABLE"
    POSSIBLE = "POSSIBLE"
    UNKNOWN = "UNKNOWN"

class EligibilityStatus(str, Enum):
    POTENTIALLY_ELIGIBLE = "POTENTIALLY_ELIGIBLE"
    NEEDS_VERIFICATION = "NEEDS_VERIFICATION"
    APPEARS_NOT_TO_MATCH = "APPEARS_NOT_TO_MATCH"
    INSUFFICIENT_INFORMATION = "INSUFFICIENT_INFORMATION"

class ActionStatus(str, Enum):
    PROPOSED = "PROPOSED"
    REQUIRES_APPROVAL = "REQUIRES_APPROVAL"
    APPROVED = "APPROVED"
    CANCELLED = "CANCELLED"
    SIMULATED_EXECUTION = "SIMULATED_EXECUTION"
    FAILED = "FAILED"

class ClassificationRequest(BaseModel):
    user_input: str

class ClassificationResponse(BaseModel):
    event_type: EventType
    confidence: float
    entities: Dict[str, Any] = {}
    clarification_needed: bool = False
    clarification_question: Optional[str] = None
    certainty: CertaintyLevel = CertaintyLevel.PROBABLE

class ContextQuestion(BaseModel):
    id: str
    question: str
    field_key: str
    type: str  # text, select, date, boolean
    options: Optional[List[str]] = None
    required: bool = True
    help_text: Optional[str] = None

class ContextCollectionRequest(BaseModel):
    event_type: EventType
    user_input: str
    context_answers: Dict[str, Any] = {}

class ContextCollectionResponse(BaseModel):
    event_type: EventType
    questions: List[ContextQuestion]
    collected_context: Dict[str, Any]
    is_complete: bool

class SourceEvidence(BaseModel):
    source_name: str
    official_url: str
    verified_date: str
    snippet: str
    authority: str

class GovernmentService(BaseModel):
    id: str
    name: str
    category: str
    authority: str
    description: str
    eligibility_conditions: List[str]
    required_documents: List[str]
    official_url: str
    source_name: str
    verified_date: str
    evidence_snippet: str

class TaskItem(BaseModel):
    task_id: str
    title: str
    description: str
    priority: int  # 1 high, 3 low
    status: TaskStatus
    dependencies: List[str] = []
    required_documents: List[str] = []
    relevant_service_id: Optional[str] = None
    relevant_service_name: Optional[str] = None
    reason: str
    evidence: Optional[SourceEvidence] = None
    next_action: str
    certainty: CertaintyLevel = CertaintyLevel.PROBABLE

class NextBestAction(BaseModel):
    action_title: str
    description: str
    target_task_id: str
    reasoning: str
    urgency: str  # High, Medium, Low
    requires_approval: bool = True
    proposed_payload: Optional[Dict[str, Any]] = None

class AgentActivity(BaseModel):
    id: str
    timestamp: str
    agent_name: str
    message: str
    status: str

class Journey(BaseModel):
    id: str
    event_type: EventType
    title: str
    user_input: str
    created_at: str
    updated_at: str
    context: Dict[str, Any]
    progress_percentage: int
    tasks: List[TaskItem]
    next_best_action: Optional[NextBestAction] = None
    activities: List[AgentActivity] = []

class JourneyCreateRequest(BaseModel):
    event_type: EventType
    user_input: str
    context: Dict[str, Any]

class EligibilityAssessment(BaseModel):
    service_id: str
    service_name: str
    status: EligibilityStatus
    reason: str
    missing_info: List[str] = []
    required_documents: List[str] = []
    certainty_category: CertaintyLevel
    source_evidence: Optional[SourceEvidence] = None

class DocumentField(BaseModel):
    key: str
    label: str
    value: str
    confidence: float
    is_valid: bool

class DocumentAnalysisResponse(BaseModel):
    document_id: str
    file_name: str
    document_type: str
    readiness_status: str  # READY, NEEDS_REVIEW, INCOMPLETE, INVALID
    detected_fields: List[DocumentField]
    missing_fields: List[str]
    target_task_ids: List[str]
    notes: str

class AgentAction(BaseModel):
    action_id: str
    journey_id: str
    title: str
    description: str
    reason: str
    source_grounding: Optional[SourceEvidence] = None
    required_info: Dict[str, Any] = {}
    expected_outcome: str
    status: ActionStatus
    created_at: str
    updated_at: str
    result: Optional[str] = None

class FrictionEvent(BaseModel):
    event_type: str
    journey_id: str
    task_id: Optional[str] = None
    description: str
    timestamp: str

class ImpactMetrics(BaseModel):
    events_processed: int
    tasks_identified: int
    tasks_completed: int
    documents_analyzed: int
    services_discovered: int
    blocked_resolved: int
    avg_time_to_action: str
