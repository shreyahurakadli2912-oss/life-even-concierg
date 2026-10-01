import json
from typing import Dict, Any
from app.models.schemas import EventType, ClassificationResponse, CertaintyLevel
from app.config import settings

class ClassificationAgent:
    def classify(self, user_input: str) -> ClassificationResponse:
        text = user_input.strip().lower()
        
        # 1. Deterministic / Regex classification engine for MVP events
        if any(w in text for w in ["baby", "born", "birth", "deliver", "pregnant", "child birth", "newborn", "maternity"]):
            return ClassificationResponse(
                event_type=EventType.CHILD_BIRTH,
                confidence=0.98,
                entities={"trigger_term": "birth/baby"},
                clarification_needed=False,
                certainty=CertaintyLevel.FACT
            )
            
        if any(w in text for w in ["passed away", "died", "death", "demise", "expired", "funeral", "father died", "mother died", "deceased"]):
            return ClassificationResponse(
                event_type=EventType.DEATH_IN_FAMILY,
                confidence=0.97,
                entities={"trigger_term": "demise/death"},
                clarification_needed=False,
                certainty=CertaintyLevel.FACT
            )
            
        if any(w in text for w in ["senior citizen", "turned 60", "retired", "60 years", "pensioner", "old age", "superannuation"]):
            return ClassificationResponse(
                event_type=EventType.SENIOR_CITIZEN,
                confidence=0.96,
                entities={"trigger_term": "senior/60+"},
                clarification_needed=False,
                certainty=CertaintyLevel.FACT
            )
            
        # Try Gemini API if key is present and not forced DEMO_MODE
        if settings.GEMINI_API_KEY and not settings.DEMO_MODE:
            try:
                from google import genai
                client = genai.Client(api_key=settings.GEMINI_API_KEY)
                prompt = f"""
                Classify the user's life event query into one of these exact types:
                - CHILD_BIRTH
                - DEATH_IN_FAMILY
                - SENIOR_CITIZEN
                - UNKNOWN

                User Query: "{user_input}"
                Return ONLY valid JSON matching format:
                {{"event_type": "CHILD_BIRTH", "confidence": 0.95, "clarification_needed": false, "clarification_question": null}}
                """
                res = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt
                )
                if res and res.text:
                    cleaned = res.text.strip().replace("```json", "").replace("```", "").strip()
                    data = json.loads(cleaned)
                    ev_str = data.get("event_type", "UNKNOWN")
                    ev_type = EventType(ev_str) if ev_str in EventType.__members__ else EventType.UNKNOWN
                    return ClassificationResponse(
                        event_type=ev_type,
                        confidence=float(data.get("confidence", 0.90)),
                        entities={},
                        clarification_needed=bool(data.get("clarification_needed", False)),
                        clarification_question=data.get("clarification_question"),
                        certainty=CertaintyLevel.PROBABLE
                    )
            except Exception:
                pass

        # Fallback for uncertain / ambiguous queries
        return ClassificationResponse(
            event_type=EventType.UNKNOWN,
            confidence=0.35,
            entities={},
            clarification_needed=True,
            clarification_question="I want to make sure I understand correctly. Are you looking for help with a newborn birth, a death in the family, or senior citizen benefits?",
            certainty=CertaintyLevel.UNKNOWN
        )

classification_agent = ClassificationAgent()
