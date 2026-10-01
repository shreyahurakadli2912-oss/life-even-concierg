import uuid
from typing import List, Dict, Any
from app.models.schemas import DocumentAnalysisResponse, DocumentField
from app.demo.mock_data import DEMO_DOCUMENT_TEMPLATES

class DocumentIntelligenceAgent:
    def analyze_document(self, file_name: str, document_type_hint: str = "") -> DocumentAnalysisResponse:
        doc_id = f"doc_{uuid.uuid4().hex[:8]}"
        fn_lower = file_name.lower()
        hint_lower = document_type_hint.lower()

        template_key = "hospital_slip"
        if "death" in fn_lower or "death" in hint_lower or "demise" in fn_lower:
            template_key = "death_report"
        elif "senior" in fn_lower or "aadhaar" in fn_lower or "age" in fn_lower or "voter" in fn_lower:
            template_key = "senior_id"

        template = DEMO_DOCUMENT_TEMPLATES[template_key]
        fields = [DocumentField(**f) for f in template["detected_fields"]]

        return DocumentAnalysisResponse(
            document_id=doc_id,
            file_name=file_name,
            document_type=template["document_type"],
            readiness_status=template["readiness_status"],
            detected_fields=fields,
            missing_fields=template["missing_fields"],
            target_task_ids=template["target_task_ids"],
            notes=template["notes"]
        )

doc_intelligence_agent = DocumentIntelligenceAgent()
