from typing import List, Dict, Any
from app.models.schemas import EventType, TaskItem, TaskStatus, CertaintyLevel, SourceEvidence
from app.demo.mock_data import JOURNEY_TEMPLATES
from app.rag.knowledge import knowledge_engine

class LifeEventPlanner:
    def create_journey_tasks(self, event_type: EventType, context: Dict[str, Any]) -> List[TaskItem]:
        templates = JOURNEY_TEMPLATES.get(event_type.value, [])
        tasks: List[TaskItem] = []
        
        for t in templates:
            evidence: Optional[SourceEvidence] = None
            if t.get("relevant_service_id"):
                evidence = knowledge_engine.get_evidence(t["relevant_service_id"])

            task = TaskItem(
                task_id=t["task_id"],
                title=t["title"],
                description=t["description"],
                priority=t["priority"],
                status=TaskStatus(t["status"]),
                dependencies=t.get("dependencies", []),
                required_documents=t.get("required_documents", []),
                relevant_service_id=t.get("relevant_service_id"),
                relevant_service_name=t.get("relevant_service_name"),
                reason=t["reason"],
                evidence=evidence,
                next_action=t["next_action"],
                certainty=CertaintyLevel(t.get("certainty", "PROBABLE"))
            )
            tasks.append(task)
            
        return tasks

planner_agent = LifeEventPlanner()
