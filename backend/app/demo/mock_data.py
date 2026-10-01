"""
Mock Data and Deterministic Engine for DEMO MODE in Life-Event Concierge.
Provides grounded government services, evidence snippets, dependency graphs, and document analysis.
"""
from typing import Dict, List, Any
from app.models.schemas import EventType, TaskStatus, CertaintyLevel, EligibilityStatus

GOVERNMENT_SERVICES_DB = [
    {
        "id": "srv_birth_reg",
        "name": "Civil Registration System (CRS) - Birth Registration",
        "category": "Identity & Records",
        "authority": "Registrar of Births and Deaths / Municipal Corporation",
        "description": "Official mandatory recording of birth within 21 days as mandated by the Registration of Births and Deaths Act.",
        "eligibility_conditions": [
            "Child born within state/district jurisdiction",
            "Reported within prescribed timeframe (21 days for standard process)"
        ],
        "required_documents": [
            "Hospital Discharge Summary / Birth Report Form 1",
            "Parents' Aadhaar Card / ID Proof",
            "Marriage Certificate of Parents (if applicable)"
        ],
        "official_url": "https://crsorgi.gov.in",
        "source_name": "Ministry of Home Affairs / Office of Registrar General",
        "verified_date": "2026-09-15",
        "evidence_snippet": "As per Section 8/13 of RBD Act 1969, every birth must be reported to the local Registrar within 21 days of occurrence."
    },
    {
        "id": "srv_pmmvy",
        "name": "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
        "category": "Maternity Benefit",
        "authority": "Ministry of Women and Child Development",
        "description": "Direct Benefit Transfer (DBT) scheme providing financial incentive for pregnant women and lactating mothers for first/second child.",
        "eligibility_conditions": [
            "Pregnant Women and Lactating Mothers (PW&LM) meeting socio-economic eligibility criteria",
            "First live child (Rs 5,000) or second child if female (Rs 6,000)",
            "Mother age 19 years or above"
        ],
        "required_documents": [
            "Child Birth Certificate",
            "Mother's Aadhaar Card",
            "Mother's Bank Account Details (Aadhaar linked)",
            "MCP Card (Mother & Child Protection Card)"
        ],
        "official_url": "https://pmmvy.wcd.gov.in",
        "source_name": "Ministry of Women & Child Development Official Portal",
        "verified_date": "2026-09-20",
        "evidence_snippet": "Financial assistance of ₹5,000 in 2 installments for 1st child and ₹6,000 for 2nd girl child subject to mandatory birth registration."
    },
    {
        "id": "srv_death_cert",
        "name": "Civil Registration System - Death Certificate & Registration",
        "category": "Identity & Legal Records",
        "authority": "Local Municipal Corporation / Registrar of Births & Deaths",
        "description": "Mandatory official recording of death and issuance of legal Death Certificate.",
        "eligibility_conditions": [
            "Death occurred within local government jurisdiction",
            "Reported by family member, hospital authority, or local representative"
        ],
        "required_documents": [
            "Medical Cause of Death Certificate / Hospital Death Summary",
            "Deceased Person's ID Proof (Aadhaar/Voter ID)",
            "Applicant's ID Proof & Relationship Proof"
        ],
        "official_url": "https://crsorgi.gov.in",
        "source_name": "Registrar General of India Official Guidelines",
        "verified_date": "2026-09-10",
        "evidence_snippet": "Official death registration is required before processing pension, bank account closure, insurance claims, or property transfer."
    },
    {
        "id": "srv_family_pension",
        "name": "Family Pension & Survivor Benefits Settlement",
        "category": "Financial & Pension",
        "authority": "Department of Pension & Pensioners' Welfare / EPFO",
        "description": "Transfer of monthly pension and terminal benefits to eligible surviving spouse or legal dependents.",
        "eligibility_conditions": [
            "Deceased was a government employee, pensioner, or EPFO subscriber",
            "Applicant is legally recognized spouse or eligible dependent child"
        ],
        "required_documents": [
            "Official Death Certificate",
            "Legal Heir Certificate / Surviving Member Certificate",
            "Spouse Bank Account (Joint/Single Aadhaar linked)",
            "PPO (Pension Payment Order) Number / PF Account Number"
        ],
        "official_url": "https://pensionersportal.gov.in",
        "source_name": "Central Pension Accounting Office (CPAO)",
        "verified_date": "2026-08-28",
        "evidence_snippet": "Family pension commences upon submission of verified Death Certificate and Form 14 by the surviving spouse."
    },
    {
        "id": "srv_senior_card",
        "name": "Senior Citizen Identity Card & Transport Concessions",
        "category": "Social Welfare & Identity",
        "authority": "Department of Social Justice & Empowerment / State Welfare Board",
        "description": "Official Senior Citizen Card granting priority services, healthcare discounts, and travel benefits.",
        "eligibility_conditions": [
            "Applicant age 60 years or above",
            "Resident of the issuing State/UT"
        ],
        "required_documents": [
            "Proof of Age (Aadhaar / Passport / Voter ID / Birth Certificate)",
            "Proof of Address (Utility Bill / Ration Card / Aadhaar)",
            "Passport Size Photograph"
        ],
        "official_url": "https://socialjustice.gov.in",
        "source_name": "National Portal of India Senior Services",
        "verified_date": "2026-09-01",
        "evidence_snippet": "Citizens completing 60 years of age qualify for official Senior Citizen status under the Maintenance and Welfare of Parents Act."
    },
    {
        "id": "srv_vayo_shreshtha",
        "name": "National Social Assistance Programme (IGNOAPS) / Senior Pension",
        "category": "Social Pension & Security",
        "authority": "Ministry of Rural Development / State Social Welfare",
        "description": "Indira Gandhi National Old Age Pension Scheme (IGNOAPS) providing monthly pension support to eligible senior citizens.",
        "eligibility_conditions": [
            "Age 60 years or older",
            "Belongs to Below Poverty Line (BPL) household or meets state income thresholds"
        ],
        "required_documents": [
            "Age Proof Document",
            "BPL Card / Certified Income Certificate",
            "Bank Account Details",
            "Aadhaar Card"
        ],
        "official_url": "https://nsap.nic.in",
        "source_name": "NSAP Direct Portal",
        "verified_date": "2026-09-05",
        "evidence_snippet": "Eligible senior citizens above 60 receive monthly social assistance support subject to verified income criteria."
    }
]

DYNAMIC_QUESTIONS: Dict[str, List[Dict[str, Any]]] = {
    "CHILD_BIRTH": [
        {
            "id": "state",
            "question": "Which State or Union Territory was the child born in?",
            "field_key": "state",
            "type": "select",
            "options": ["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Uttar Pradesh", "West Bengal", "Gujarat", "Other State"],
            "required": True,
            "help_text": "Required to identify municipal registration rules."
        },
        {
            "id": "dob",
            "question": "Date of Birth of the child",
            "field_key": "date_of_birth",
            "type": "date",
            "required": True,
            "help_text": "Helps check the 21-day standard birth registration window."
        },
        {
            "id": "birth_place",
            "question": "Was the birth institutional (hospital) or at home?",
            "field_key": "birth_place_type",
            "type": "select",
            "options": ["Government Hospital", "Private Hospital", "Home / Other"],
            "required": True
        },
        {
            "id": "child_order",
            "question": "Is this the family's first or second child?",
            "field_key": "child_order",
            "type": "select",
            "options": ["First Child", "Second Child", "Third or Subsequent"],
            "required": False,
            "help_text": "Determines eligibility for maternity benefit schemes (e.g. PMMVY)."
        }
    ],
    "DEATH_IN_FAMILY": [
        {
            "id": "state",
            "question": "State/UT where the demise occurred",
            "field_key": "state",
            "type": "select",
            "options": ["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Uttar Pradesh", "West Bengal", "Gujarat", "Other State"],
            "required": True
        },
        {
            "id": "relationship",
            "question": "Your relationship to the deceased",
            "field_key": "relationship",
            "type": "select",
            "options": ["Spouse", "Son / Daughter", "Parent", "Sibling", "Other Legal Heir"],
            "required": True
        },
        {
            "id": "dod",
            "question": "Date of demise",
            "field_key": "date_of_death",
            "type": "date",
            "required": True
        },
        {
            "id": "pension_status",
            "question": "Was the deceased receiving a government pension or EPFO subscriber?",
            "field_key": "pension_status",
            "type": "select",
            "options": ["Yes - Government Pensioner", "Yes - EPFO / Private Sector", "No / Unknown"],
            "required": False
        }
    ],
    "SENIOR_CITIZEN": [
        {
            "id": "age",
            "question": "Current age of the citizen (or date of birth)",
            "field_key": "age",
            "type": "select",
            "options": ["60-64 years", "65-79 years", "80+ years"],
            "required": True
        },
        {
            "id": "state",
            "question": "State of permanent residence",
            "field_key": "state",
            "type": "select",
            "options": ["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Uttar Pradesh", "West Bengal", "Gujarat", "Other State"],
            "required": True
        },
        {
            "id": "income_tier",
            "question": "Income level / BPL status (optional for benefit discovery)",
            "field_key": "income_tier",
            "type": "select",
            "options": ["General Category", "Low Income / BPL Card Holder", "Pensioner / Retd Employee"],
            "required": False
        }
    ]
}

JOURNEY_TEMPLATES: Dict[str, List[Dict[str, Any]]] = {
    "CHILD_BIRTH": [
        {
            "task_id": "task_cb_1",
            "title": "Hospital Birth Slip & Record Verification",
            "description": "Obtain and review official Hospital Discharge Summary / Birth Reporting Slip from medical facility.",
            "priority": 1,
            "status": "READY",
            "dependencies": [],
            "required_documents": ["Hospital Birth Slip / Discharge Summary"],
            "relevant_service_id": "srv_birth_reg",
            "relevant_service_name": "Civil Registration System (CRS)",
            "reason": "Hospital discharge slip contains critical birth timestamp and hospital registration reference number.",
            "next_action": "Upload or verify Hospital Birth Slip document.",
            "certainty": "FACT"
        },
        {
            "task_id": "task_cb_2",
            "title": "Municipal Birth Registration Application",
            "description": "Submit formal birth registration request to local Municipal Registrar / Panchayat.",
            "priority": 1,
            "status": "LOCKED",
            "dependencies": ["task_cb_1"],
            "required_documents": ["Hospital Birth Slip", "Parents ID Proof"],
            "relevant_service_id": "srv_birth_reg",
            "relevant_service_name": "Civil Registration System (CRS)",
            "reason": "Requires verified hospital birth slip before submission to municipal authority.",
            "next_action": "Prepare birth registration application checklist.",
            "certainty": "PROBABLE"
        },
        {
            "task_id": "task_cb_3",
            "title": "Issuance of Official Birth Certificate",
            "description": "Receive and store the digitally signed Official Birth Certificate from municipal portal.",
            "priority": 2,
            "status": "LOCKED",
            "dependencies": ["task_cb_2"],
            "required_documents": ["Registration Application Receipt"],
            "relevant_service_id": "srv_birth_reg",
            "relevant_service_name": "Civil Registration System (CRS)",
            "reason": "Official birth certificate is the foundational document required for all child benefit & identity processes.",
            "next_action": "Download and upload verified digital Birth Certificate.",
            "certainty": "PROBABLE"
        },
        {
            "task_id": "task_cb_4",
            "title": "Maternity Benefit Discovery & Eligibility Check",
            "description": "Assess eligibility for PMMVY maternity grant (₹5,000 - ₹6,000 direct benefit transfer).",
            "priority": 2,
            "status": "LOCKED",
            "dependencies": ["task_cb_3"],
            "required_documents": ["Official Birth Certificate", "Mother Aadhaar Card", "Bank Account Details"],
            "relevant_service_id": "srv_pmmvy",
            "relevant_service_name": "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
            "reason": "PMMVY benefit application requires verified birth certificate details.",
            "next_action": "Review eligibility breakdown and submit approval request for PMMVY application checklist.",
            "certainty": "POSSIBLE"
        },
        {
            "task_id": "task_cb_5",
            "title": "Child Healthcare & Immunization Record Setup",
            "description": "Enroll in Mother and Child Protection (MCP) card tracking for mandatory immunization schedule.",
            "priority": 3,
            "status": "LOCKED",
            "dependencies": ["task_cb_1"],
            "required_documents": ["Hospital Birth Slip"],
            "relevant_service_id": "srv_pmmvy",
            "relevant_service_name": "National Health Mission",
            "reason": "Immunization setup runs parallel once hospital birth slip is verified.",
            "next_action": "Confirm healthcare provider registration.",
            "certainty": "PROBABLE"
        }
    ],
    "DEATH_IN_FAMILY": [
        {
            "task_id": "task_df_1",
            "title": "Medical Death Slip & Registration",
            "description": "Collect Medical Cause of Death certificate / Hospital slip for local registrar submission.",
            "priority": 1,
            "status": "READY",
            "dependencies": [],
            "required_documents": ["Medical Death Certificate / Hospital Summary"],
            "relevant_service_id": "srv_death_cert",
            "relevant_service_name": "Civil Registration System - Death Registration",
            "reason": "Immediate administrative requirement within local municipal timeframe.",
            "next_action": "Verify medical death summary document.",
            "certainty": "FACT"
        },
        {
            "task_id": "task_df_2",
            "title": "Official Death Certificate Issuance",
            "description": "Obtain official legal Death Certificate from local Municipal Corporation.",
            "priority": 1,
            "status": "LOCKED",
            "dependencies": ["task_df_1"],
            "required_documents": ["Medical Death Slip", "Deceased ID Proof"],
            "relevant_service_id": "srv_death_cert",
            "relevant_service_name": "Civil Registration System",
            "reason": "Official legal death certificate unlocks all financial, pension, bank, and survivor benefits.",
            "next_action": "Submit death registration application.",
            "certainty": "PROBABLE"
        },
        {
            "task_id": "task_df_3",
            "title": "Family Pension & Survivor Benefits Assessment",
            "description": "Initiate pension settlement and Form 14 submission for surviving spouse or dependent.",
            "priority": 2,
            "status": "LOCKED",
            "dependencies": ["task_df_2"],
            "required_documents": ["Official Death Certificate", "Spouse Aadhaar Card", "PPO / PF Number"],
            "relevant_service_id": "srv_family_pension",
            "relevant_service_name": "Family Pension & Survivor Benefits Settlement",
            "reason": "Family pension submission strictly requires official legal Death Certificate.",
            "next_action": "Verify spouse pension details & generate pension claim packet.",
            "certainty": "POSSIBLE"
        },
        {
            "task_id": "task_df_4",
            "title": "Surviving Member / Legal Heir Certificate Checklist",
            "description": "Prepare document readiness checklist for Legal Heir Certificate from local Revenue Department / Tehsildar.",
            "priority": 2,
            "status": "LOCKED",
            "dependencies": ["task_df_2"],
            "required_documents": ["Official Death Certificate", "Family Ration Card", "Legal Heirs ID Proof"],
            "relevant_service_id": "srv_death_cert",
            "relevant_service_name": "Revenue Department",
            "reason": "Needed for bank account transfer, insurance claims, and property records.",
            "next_action": "Review legal heir application requirements.",
            "certainty": "POSSIBLE"
        }
    ],
    "SENIOR_CITIZEN": [
        {
            "task_id": "task_sc_1",
            "title": "Age & Identity Verification",
            "description": "Verify government age proof to establish senior citizen threshold (60+ years).",
            "priority": 1,
            "status": "READY",
            "dependencies": [],
            "required_documents": ["Aadhaar Card / Passport / Voter ID"],
            "relevant_service_id": "srv_senior_card",
            "relevant_service_name": "Senior Citizen Welfare Portal",
            "reason": "First step to confirm official senior citizenship eligibility.",
            "next_action": "Upload age proof document (Aadhaar or Voter ID).",
            "certainty": "FACT"
        },
        {
            "task_id": "task_sc_2",
            "title": "Senior Citizen ID Card Application",
            "description": "Apply for official State Senior Citizen Card for healthcare, transport, and municipal concessions.",
            "priority": 1,
            "status": "LOCKED",
            "dependencies": ["task_sc_1"],
            "required_documents": ["Verified Age Proof", "Address Proof", "Passport Photo"],
            "relevant_service_id": "srv_senior_card",
            "relevant_service_name": "State Department of Social Welfare",
            "reason": "Requires verified age and residency proof.",
            "next_action": "Prepare Senior Citizen Card application checklist.",
            "certainty": "PROBABLE"
        },
        {
            "task_id": "task_sc_3",
            "title": "Social Security & Pension Scheme Evaluation",
            "description": "Evaluate eligibility for IGNOAPS old-age pension or senior welfare monthly assistance.",
            "priority": 2,
            "status": "LOCKED",
            "dependencies": ["task_sc_1"],
            "required_documents": ["Age Proof", "Income Certificate / BPL Card", "Bank Account Details"],
            "relevant_service_id": "srv_vayo_shreshtha",
            "relevant_service_name": "National Social Assistance Programme (IGNOAPS)",
            "reason": "Evaluation of pension options depends on age verification and income threshold status.",
            "next_action": "Check income details for social pension scheme.",
            "certainty": "POSSIBLE"
        }
    ]
}

DEMO_DOCUMENT_TEMPLATES = {
    "hospital_slip": {
        "document_type": "Hospital Birth Discharge Summary",
        "readiness_status": "READY",
        "detected_fields": [
            {"key": "child_name", "label": "Child / Baby Name", "value": "Baby of Ananya Sharma", "confidence": 0.98, "is_valid": True},
            {"key": "date_of_birth", "label": "Date of Birth", "value": "2026-09-29", "confidence": 0.99, "is_valid": True},
            {"key": "hospital_name", "label": "Hospital Name", "value": "City Civil General Hospital, Ward 4", "confidence": 0.96, "is_valid": True},
            {"key": "mother_name", "label": "Mother's Name", "value": "Ananya Sharma", "confidence": 0.97, "is_valid": True},
            {"key": "father_name", "label": "Father's Name", "value": "Rahul Sharma", "confidence": 0.95, "is_valid": True}
        ],
        "missing_fields": [],
        "target_task_ids": ["task_cb_1"],
        "notes": "Hospital birth slip validated. Ready to unlock Municipal Birth Registration task."
    },
    "death_report": {
        "document_type": "Medical Cause of Death Slip",
        "readiness_status": "READY",
        "detected_fields": [
            {"key": "deceased_name", "label": "Deceased Full Name", "value": "Ramesh Chandra Sharma", "confidence": 0.98, "is_valid": True},
            {"key": "date_of_death", "label": "Date of Death", "value": "2026-09-25", "confidence": 0.99, "is_valid": True},
            {"key": "place_of_death", "label": "Place / Hospital Name", "value": "Metro Specialty Hospital", "confidence": 0.95, "is_valid": True},
            {"key": "age", "label": "Age at Demise", "value": "68 Years", "confidence": 0.96, "is_valid": True}
        ],
        "missing_fields": [],
        "target_task_ids": ["task_df_1"],
        "notes": "Medical death record verified. Ready for Death Certificate application."
    },
    "senior_id": {
        "document_type": "Age & Residence Identity Proof (Aadhaar / Voter ID)",
        "readiness_status": "READY",
        "detected_fields": [
            {"key": "full_name", "label": "Citizen Name", "value": "Sunita Verma", "confidence": 0.99, "is_valid": True},
            {"key": "date_of_birth", "label": "Date of Birth", "value": "1964-04-12", "confidence": 0.98, "is_valid": True},
            {"key": "calculated_age", "label": "Calculated Age", "value": "62 Years", "confidence": 1.0, "is_valid": True},
            {"key": "address", "label": "State Address", "value": "Flat 302, Green Enclave, Pune, Maharashtra", "confidence": 0.94, "is_valid": True}
        ],
        "missing_fields": [],
        "target_task_ids": ["task_sc_1"],
        "notes": "Age requirement (60+ years) satisfied. Senior Citizen Card task unlocked."
    }
}
