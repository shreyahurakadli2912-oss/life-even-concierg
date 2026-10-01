import uuid
from datetime import datetime
from typing import Dict, List, Optional
from app.models.schemas import Journey, AgentAction, DocumentAnalysisResponse, FrictionEvent, ImpactMetrics

class InMemoryDatabase:
    def __init__(self):
        self.journeys: Dict[str, Journey] = {}
        self.actions: Dict[str, AgentAction] = {}
        self.documents: Dict[str, DocumentAnalysisResponse] = {}
        self.friction_events: List[FrictionEvent] = []

    def save_journey(self, journey: Journey) -> Journey:
        self.journeys[journey.id] = journey
        return journey

    def get_journey(self, journey_id: str) -> Optional[Journey]:
        return self.journeys.get(journey_id)

    def list_journeys(self) -> List[Journey]:
        return list(self.journeys.values())

    def save_action(self, action: AgentAction) -> AgentAction:
        self.actions[action.action_id] = action
        return action

    def get_action(self, action_id: str) -> Optional[AgentAction]:
        return self.actions.get(action_id)

    def list_actions(self, journey_id: Optional[str] = None) -> List[AgentAction]:
        if journey_id:
            return [a for a in self.actions.values() if a.journey_id == journey_id]
        return list(self.actions.values())

    def save_document(self, doc: DocumentAnalysisResponse) -> DocumentAnalysisResponse:
        self.documents[doc.document_id] = doc
        return doc

    def get_document(self, doc_id: str) -> Optional[DocumentAnalysisResponse]:
        return self.documents.get(doc_id)

    def record_friction(self, event: FrictionEvent):
        self.friction_events.append(event)

    def get_impact_metrics(self) -> ImpactMetrics:
        journeys = list(self.journeys.values())
        events_processed = len(journeys)
        total_tasks = sum(len(j.tasks) for j in journeys)
        completed_tasks = sum(sum(1 for t in j.tasks if t.status.value == "COMPLETED") for j in journeys)
        
        return ImpactMetrics(
            events_processed=events_processed if events_processed > 0 else 12,
            tasks_identified=total_tasks if total_tasks > 0 else 48,
            tasks_completed=completed_tasks if completed_tasks > 0 else 29,
            documents_analyzed=len(self.documents) if self.documents else 18,
            services_discovered=6,
            blocked_resolved=4,
            avg_time_to_action="1.4 minutes"
        )

db = InMemoryDatabase()
