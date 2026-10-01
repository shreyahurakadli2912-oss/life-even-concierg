from typing import List, Dict, Any
from app.models.schemas import EligibilityAssessment, EligibilityStatus, CertaintyLevel
from app.rag.knowledge import knowledge_engine

class EligibilityReasoningAgent:
    def evaluate(self, service_id: str, context: Dict[str, Any], documents_available: List[str]) -> EligibilityAssessment:
        srv = knowledge_engine.get_service_by_id(service_id)
        if not srv:
            return EligibilityAssessment(
                service_id=service_id,
                service_name="Unknown Service",
                status=EligibilityStatus.INSUFFICIENT_INFORMATION,
                reason="Service details not found in government knowledge layer.",
                missing_info=["Service database record"],
                required_documents=[],
                certainty_category=CertaintyLevel.UNKNOWN,
                source_evidence=None
            )

        evidence = knowledge_engine.get_evidence(service_id)
        missing_info = []
        status = EligibilityStatus.POTENTIALLY_ELIGIBLE
        certainty = CertaintyLevel.POSSIBLE

        # Scheme specific deterministic checks
        if service_id == "srv_pmmvy":
            child_order = context.get("child_order")
            if child_order == "Third or Subsequent":
                status = EligibilityStatus.APPEARS_NOT_TO_MATCH
                reason = "PMMVY scheme rules restrict financial grants to the 1st or 2nd child."
            elif not child_order:
                status = EligibilityStatus.NEEDS_VERIFICATION
                missing_info.append("Child birth order (1st vs 2nd child)")
                reason = "Requires confirmation of child birth order."
            else:
                status = EligibilityStatus.POTENTIALLY_ELIGIBLE
                reason = "Profile satisfies initial criteria for maternity grant under PMMVY rules."
                certainty = CertaintyLevel.PROBABLE

        elif service_id == "srv_birth_reg" or service_id == "srv_death_cert":
            status = EligibilityStatus.POTENTIALLY_ELIGIBLE
            reason = "Mandatory civil registration applies to all citizens in the jurisdiction."
            certainty = CertaintyLevel.FACT

        elif service_id == "srv_vayo_shreshtha":
            income_tier = context.get("income_tier")
            if income_tier == "Low Income / BPL Card Holder":
                status = EligibilityStatus.POTENTIALLY_ELIGIBLE
                reason = "Meets social assistance threshold based on reported BPL/Low Income status."
                certainty = CertaintyLevel.PROBABLE
            else:
                status = EligibilityStatus.NEEDS_VERIFICATION
                missing_info.append("Certified Income Certificate / BPL Card")
                reason = "Income threshold verification required for pension assistance scheme."

        else:
            status = EligibilityStatus.POTENTIALLY_ELIGIBLE
            reason = "Initial criteria met based on current life event context."

        return EligibilityAssessment(
            service_id=srv["id"],
            service_name=srv["name"],
            status=status,
            reason=reason,
            missing_info=missing_info,
            required_documents=srv["required_documents"],
            certainty_category=certainty,
            source_evidence=evidence
        )

eligibility_agent = EligibilityReasoningAgent()
