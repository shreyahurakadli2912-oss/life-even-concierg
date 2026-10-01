# LIFE-EVENT CONCIERGE

> **Tagline:** *"One life event. One guided journey. Zero confusion."*  
> **Core Statement:** *"Tell us what happened in your life. We figure out what needs to happen next."*

---

## 🚀 Overview

**LIFE-EVENT CONCIERGE** is an **Agentic AI Citizen-Service Orchestration Platform**. It transforms complex, multi-departmental government services into a single, personalized, dependency-aware guided journey.

Citizens interact with public services through **life events**, not administrative departments. When a major life event occurs, a citizen shouldn't need to understand government organizational charts or search through dozens of disconnected portals.

---

## 🏛️ Supported Life Events (Hackathon MVP Scope)

The MVP deeply supports three distinct citizen situations using the same core agent orchestrator:

1. **👶 Child Birth / New Baby (`CHILD_BIRTH`)**
   - Birth registration (CRS), hospital slip verification, official birth certificate issuance, maternity benefit eligibility assessment (PMMVY ₹6,000 grant), and child immunization setup.
2. **🕊️ Death in the Family (`DEATH_IN_FAMILY`)**
   - Respectful administration for medical cause of death recording, municipal death certificate issuance, spouse family pension transfer, EPFO survivor settlement, and legal heir checklist.
3. **👴 Senior Citizenship / Retirement (`SENIOR_CITIZEN`)**
   - Official Senior Citizen Identity Card application, transport/healthcare concession discovery, and IGNOAPS social security old-age pension evaluation.

---

## 🤖 Agentic AI Architecture

The system operates as an autonomous agentic loop:

```
OBSERVE → UNDERSTAND → CLASSIFY LIFE EVENT → COLLECT CONTEXT → PLAN
   ↓
RETRIEVE (RAG) → REASON → CHECK ELIGIBILITY → CHECK DOCUMENTS → PRIORITIZE
   ↓
RECOMMEND NEXT BEST ACTION → REQUEST HUMAN APPROVAL → SIMULATE EXECUTION
   ↓
MONITOR → UPDATE STATE → ADAPTIVE REPLANNING
```

### Key Agents & Engines:
- **Life Event Classification Agent:** NLU classification with certainty levels (`FACT`, `PROBABLE`, `POSSIBLE`, `UNKNOWN`).
- **Context Collection Agent:** Minimum dynamic questioning engine.
- **Life Event Planner:** Dependency-aware task graph generator.
- **Dependency Engine:** Calculates dynamic task unlocks (`LOCKED` → `READY` → `COMPLETED`).
- **Next Best Action Agent:** Prioritizes top urgency step with explicit rationale (*WHY*).
- **Government Knowledge Engine & RAG:** Grounded in official government sources with verified date stamps and source evidence links.
- **Eligibility Reasoning Agent:** Certainty-categorized eligibility checks (`POTENTIALLY_ELIGIBLE`, `NEEDS_VERIFICATION`).
- **Document Intelligence Agent:** OCR field extraction and document readiness assessment.
- **Human-in-the-Loop Action Center:** Enforces explicit citizen approval before consequential simulated actions.
- **Monitoring & Adaptive Replanning Agent:** Monitors execution results and updates the journey graph automatically.

---

## 🛠️ Technology Stack

- **Backend:** Python 3.13, FastAPI, Pydantic v2, Uvicorn, Google GenAI SDK
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Framer Motion, `@xyflow/react`
- **Data Persistence & RAG:** In-memory / SQLite store, structured evidence layer
- **Fallback Engine:** Seamless offline DEMO MODE for deterministic hackathon evaluation

---

## 🚦 Quickstart & Setup

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🔑 Environment Variables & Demo Mode

Copy `.env.example` to `.env`:

```env
GEMINI_API_KEY=your_optional_key
SUPABASE_URL=
SUPABASE_ANON_KEY=
DATABASE_URL=sqlite:///./concierge.db
DEMO_MODE=true
PORT=8000
```

> **Note:** The application operates in **100% DEMO MODE** by default, allowing full interactive evaluation even without external API keys or internet connectivity.

---

## 🔌 API Endpoints

- `POST /api/events/classify`: Classify life event prompt
- `POST /api/events/context`: Fetch minimum dynamic context questions
- `POST /api/journey/create`: Generate dependency-aware journey graph
- `GET /api/journey/{id}`: Retrieve active journey state
- `POST /api/journey/{id}/tasks/{task_id}/complete`: Complete task and recalculate graph
- `GET /api/services/search`: Query grounded government knowledge layer
- `POST /api/eligibility/check`: Source-grounded eligibility evaluation
- `POST /api/documents/analyze`: OCR field extraction & document readiness check
- `POST /api/actions/{id}/approve`: Human-in-the-loop approval & simulated execution
- `GET /api/analytics/friction`: Prototype friction analytics & impact metrics

---

## 🌐 Extensibility

Additional life events (e.g., *Marriage*, *Job Loss*, *Starting a Business*, *College Admission*) can be added purely through backend configuration templates (`DYNAMIC_QUESTIONS` and `JOURNEY_TEMPLATES`) without modifying orchestrator or dependency engine logic.
