from typing import Dict, Any, List
from app.models.schemas import EventType, ContextQuestion, ContextCollectionResponse
from app.demo.mock_data import DYNAMIC_QUESTIONS

class ContextCollectionAgent:
    def get_questions(self, event_type: EventType, collected: Dict[str, Any]) -> ContextCollectionResponse:
        event_key = event_type.value
        raw_questions = DYNAMIC_QUESTIONS.get(event_key, [])
        
        parsed_questions: List[ContextQuestion] = []
        for q in raw_questions:
            # Only ask question if not already answered
            if q["field_key"] not in collected:
                parsed_questions.append(ContextQuestion(**q))
                
        is_complete = len(parsed_questions) == 0 or all(k in collected for k in [q["field_key"] for q in raw_questions if q.get("required")])
        
        return ContextCollectionResponse(
            event_type=event_type,
            questions=parsed_questions,
            collected_context=collected,
            is_complete=is_complete
        )

context_agent = ContextCollectionAgent()
