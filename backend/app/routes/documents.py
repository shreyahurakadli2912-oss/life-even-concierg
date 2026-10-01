from fastapi import APIRouter, File, UploadFile, Form, HTTPException, Body
from typing import Optional
from pydantic import BaseModel
from app.models.schemas import DocumentAnalysisResponse
from app.agents.doc_intelligence import doc_intelligence_agent
from app.database.db import db

router = APIRouter(prefix="/documents", tags=["Document Intelligence"])

class DocumentAnalysisRequest(BaseModel):
    file_name: Optional[str] = "demo_document.pdf"
    document_type_hint: Optional[str] = ""

@router.post("/analyze", response_model=DocumentAnalysisResponse)
async def analyze_document(req: DocumentAnalysisRequest = Body(default_factory=DocumentAnalysisRequest)):
    name = req.file_name or "demo_document.pdf"
    doc_result = doc_intelligence_agent.analyze_document(name, req.document_type_hint or "")
    return db.save_document(doc_result)

@router.get("/{id}", response_model=DocumentAnalysisResponse)
def get_document(id: str):
    doc = db.get_document(id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document analysis record not found")
    return doc

