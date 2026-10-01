from typing import List, Optional, Dict, Any
from app.models.schemas import GovernmentService, SourceEvidence
from app.demo.mock_data import GOVERNMENT_SERVICES_DB

class KnowledgeEngine:
    def __init__(self):
        self.services = GOVERNMENT_SERVICES_DB

    def search_services(self, query: str, category: Optional[str] = None) -> List[Dict[str, Any]]:
        query_lower = query.lower()
        results = []
        for srv in self.services:
            match = False
            if query_lower in srv["name"].lower() or query_lower in srv["description"].lower() or query_lower in srv["category"].lower():
                match = True
            elif any(query_lower in kw for kw in srv["authority"].lower().split()):
                match = True
            elif query_lower == "all" or query_lower == "":
                match = True
            
            if category and srv["category"].lower() != category.lower():
                match = False
                
            if match:
                results.append(srv)
        return results

    def get_service_by_id(self, service_id: str) -> Optional[Dict[str, Any]]:
        for srv in self.services:
            if srv["id"] == service_id:
                return srv
        return None

    def get_evidence(self, service_id: str) -> Optional[SourceEvidence]:
        srv = self.get_service_by_id(service_id)
        if srv:
            return SourceEvidence(
                source_name=srv["source_name"],
                official_url=srv["official_url"],
                verified_date=srv["verified_date"],
                snippet=srv["evidence_snippet"],
                authority=srv["authority"]
            )
        return None

knowledge_engine = KnowledgeEngine()
