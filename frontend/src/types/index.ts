export type EventType = 'CHILD_BIRTH' | 'DEATH_IN_FAMILY' | 'SENIOR_CITIZEN' | 'UNKNOWN';

export type TaskStatus = 'LOCKED' | 'READY' | 'IN_PROGRESS' | 'NEEDS_REVIEW' | 'COMPLETED' | 'BLOCKED';

export type CertaintyLevel = 'FACT' | 'PROBABLE' | 'POSSIBLE' | 'UNKNOWN';

export type EligibilityStatus = 'POTENTIALLY_ELIGIBLE' | 'NEEDS_VERIFICATION' | 'APPEARS_NOT_TO_MATCH' | 'INSUFFICIENT_INFORMATION';

export type ActionStatus = 'PROPOSED' | 'REQUIRES_APPROVAL' | 'APPROVED' | 'CANCELLED' | 'SIMULATED_EXECUTION' | 'FAILED';

export interface SourceEvidence {
  source_name: string;
  official_url: string;
  verified_date: string;
  snippet: string;
  authority: string;
}

export interface TaskItem {
  task_id: string;
  title: string;
  description: string;
  priority: number;
  status: TaskStatus;
  dependencies: string[];
  required_documents: string[];
  relevant_service_id?: string;
  relevant_service_name?: string;
  reason: string;
  evidence?: SourceEvidence;
  next_action: string;
  certainty: CertaintyLevel;
}

export interface NextBestAction {
  action_title: string;
  description: string;
  target_task_id: string;
  reasoning: string;
  urgency: 'High' | 'Medium' | 'Low';
  requires_approval: boolean;
  proposed_payload?: Record<string, any>;
}

export interface AgentActivity {
  id: string;
  timestamp: string;
  agent_name: string;
  message: string;
  status: string;
}

export interface Journey {
  id: string;
  event_type: EventType;
  title: string;
  user_input: string;
  created_at: string;
  updated_at: string;
  context: Record<string, any>;
  progress_percentage: number;
  tasks: TaskItem[];
  next_best_action?: NextBestAction;
  activities: AgentActivity[];
}

export interface GovernmentService {
  id: string;
  name: string;
  category: string;
  authority: string;
  description: string;
  eligibility_conditions: string[];
  required_documents: string[];
  official_url: string;
  source_name: string;
  verified_date: string;
  evidence_snippet: string;
}

export interface EligibilityAssessment {
  service_id: string;
  service_name: string;
  status: EligibilityStatus;
  reason: string;
  missing_info: string[];
  required_documents: string[];
  certainty_category: CertaintyLevel;
  source_evidence?: SourceEvidence;
}

export interface DocumentField {
  key: string;
  label: string;
  value: string;
  confidence: number;
  is_valid: boolean;
}

export interface DocumentAnalysisResponse {
  document_id: string;
  file_name: string;
  document_type: string;
  readiness_status: 'READY' | 'NEEDS_REVIEW' | 'INCOMPLETE' | 'INVALID';
  detected_fields: DocumentField[];
  missing_fields: string[];
  target_task_ids: string[];
  notes: string;
}

export interface AgentAction {
  action_id: string;
  journey_id: string;
  title: string;
  description: string;
  reason: string;
  source_grounding?: SourceEvidence;
  required_info: Record<string, any>;
  expected_outcome: string;
  status: ActionStatus;
  created_at: string;
  updated_at: string;
  result?: string;
}

export interface ContextQuestion {
  id: string;
  question: string;
  field_key: string;
  type: 'text' | 'select' | 'date' | 'boolean';
  options?: string[];
  required: boolean;
  help_text?: string;
}

export interface ImpactMetrics {
  events_processed: number;
  tasks_identified: number;
  tasks_completed: number;
  documents_analyzed: number;
  services_discovered: number;
  blocked_resolved: number;
  avg_time_to_action: string;
}
