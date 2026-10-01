import type {
  EventType,
  Journey,
  GovernmentService,
  EligibilityAssessment,
  DocumentAnalysisResponse,
  AgentAction,
  ContextQuestion
} from '../types';

const API_BASE = '/api';

async function fetchJSON<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`Backend call failed for ${endpoint}, falling back to local simulation mode:`, err);
    return getFallbackData<T>(endpoint, options);
  }
}

// Client-side fallback engine for seamless DEMO MODE
function getFallbackData<T>(endpoint: string, options?: RequestInit): T {
  const body = options?.body ? JSON.parse(options.body as string) : {};

  if (endpoint === '/events/classify') {
    const text = (body.user_input || '').toLowerCase();
    let ev: EventType = 'CHILD_BIRTH';
    if (text.includes('die') || text.includes('death') || text.includes('pass')) ev = 'DEATH_IN_FAMILY';
    if (text.includes('60') || text.includes('senior') || text.includes('retir')) ev = 'SENIOR_CITIZEN';
    
    return {
      event_type: ev,
      confidence: 0.98,
      entities: { trigger: 'local_demo' },
      clarification_needed: false,
      certainty: 'FACT'
    } as unknown as T;
  }

  if (endpoint === '/events/context') {
    const ev = body.event_type || 'CHILD_BIRTH';
    const questions: ContextQuestion[] = ev === 'CHILD_BIRTH' ? [
      { id: 'state', question: 'State/UT where child was born', field_key: 'state', type: 'select', options: ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu'], required: true },
      { id: 'dob', question: 'Date of Birth', field_key: 'date_of_birth', type: 'date', required: true },
      { id: 'birth_place', question: 'Place of Birth', field_key: 'birth_place_type', type: 'select', options: ['Government Hospital', 'Private Hospital', 'Home'], required: true },
      { id: 'child_order', question: 'Child Order in Family', field_key: 'child_order', type: 'select', options: ['First Child', 'Second Child', 'Third+'], required: false }
    ] : ev === 'DEATH_IN_FAMILY' ? [
      { id: 'state', question: 'State of demise', field_key: 'state', type: 'select', options: ['Maharashtra', 'Delhi', 'Karnataka'], required: true },
      { id: 'relationship', question: 'Relationship to deceased', field_key: 'relationship', type: 'select', options: ['Spouse', 'Son / Daughter', 'Parent'], required: true },
      { id: 'dod', question: 'Date of Death', field_key: 'date_of_death', type: 'date', required: true }
    ] : [
      { id: 'age', question: 'Current Age', field_key: 'age', type: 'select', options: ['60-64 years', '65-79 years', '80+ years'], required: true },
      { id: 'state', question: 'State of Residence', field_key: 'state', type: 'select', options: ['Maharashtra', 'Delhi', 'Karnataka'], required: true }
    ];

    return {
      event_type: ev,
      questions: questions.filter(q => !body.context_answers?.[q.field_key]),
      collected_context: body.context_answers || {},
      is_complete: true
    } as unknown as T;
  }

  if (endpoint === '/journey/create') {
    const ev: EventType = body.event_type || 'CHILD_BIRTH';
    return mockJourney(ev, body.user_input || '', body.context || {}) as unknown as T;
  }

  if (endpoint.includes('/tasks/') && endpoint.includes('/complete')) {
    return mockJourney('CHILD_BIRTH', 'We had a baby yesterday', {}, true) as unknown as T;
  }

  if (endpoint.includes('/actions') && endpoint.includes('/approve')) {
    return {
      action_id: 'act_demo',
      journey_id: 'jrn_demo',
      title: 'Prepare Application Checklist',
      description: 'Application packet prepared',
      reason: 'User approved',
      expected_outcome: 'Simulated execution completed successfully',
      status: 'SIMULATED_EXECUTION',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      result: 'SIMULATED EXECUTION SUCCESSFUL: Digital receipt issued REC-78492'
    } as unknown as T;
  }

  if (endpoint === '/analytics/friction') {
    return {
      most_missing_document: 'Hospital Birth Reporting Form 1',
      most_blocked_task: 'Maternity Benefit Scheme Application',
      most_requested_clarification: 'Child birth order eligibility threshold',
      total_friction_events: 18,
      impact_metrics: {
        events_processed: 14,
        tasks_identified: 56,
        tasks_completed: 38,
        documents_analyzed: 22,
        services_discovered: 6,
        blocked_resolved: 5,
        avg_time_to_action: '1.2 minutes'
      }
    } as unknown as T;
  }

  if (endpoint.startsWith('/services')) {
    const mockServices: GovernmentService[] = [
      {
        id: "srv_birth_reg",
        name: "Civil Registration System (CRS) - Birth Registration",
        category: "Identity & Records",
        authority: "Registrar of Births and Deaths / Municipal Corporation",
        description: "Official mandatory recording of birth within 21 days as mandated by the Registration of Births and Deaths Act.",
        eligibility_conditions: ["Child born within state/district jurisdiction", "Reported within prescribed timeframe (21 days)"],
        required_documents: ["Hospital Discharge Summary / Birth Report Form 1", "Parents' Aadhaar Card / ID Proof"],
        official_url: "https://crsorgi.gov.in",
        source_name: "Ministry of Home Affairs / Office of Registrar General",
        verified_date: "2026-09-15",
        evidence_snippet: "As per Section 8/13 of RBD Act 1969, every birth must be reported to the local Registrar within 21 days of occurrence."
      },
      {
        id: "srv_pmmvy",
        name: "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
        category: "Maternity Benefit",
        authority: "Ministry of Women and Child Development",
        description: "Direct Benefit Transfer (DBT) scheme providing financial incentive for pregnant women and lactating mothers.",
        eligibility_conditions: ["Pregnant Women and Lactating Mothers meeting criteria", "First or second child"],
        required_documents: ["Child Birth Certificate", "Mother's Aadhaar Card", "MCP Card"],
        official_url: "https://pmmvy.wcd.gov.in",
        source_name: "Ministry of Women & Child Development Official Portal",
        verified_date: "2026-09-20",
        evidence_snippet: "Financial assistance of ₹5,000 in 2 installments for 1st child and ₹6,000 for 2nd girl child."
      },
      {
        id: "srv_death_cert",
        name: "Civil Registration System - Death Certificate & Registration",
        category: "Identity & Legal Records",
        authority: "Local Municipal Corporation / Registrar of Births & Deaths",
        description: "Mandatory official recording of death and issuance of legal Death Certificate.",
        eligibility_conditions: ["Death occurred within local government jurisdiction"],
        required_documents: ["Medical Cause of Death Certificate", "Deceased Person's ID Proof"],
        official_url: "https://crsorgi.gov.in",
        source_name: "Registrar General of India Official Guidelines",
        verified_date: "2026-09-10",
        evidence_snippet: "Official death registration is required before processing pension or bank account closure."
      },
      {
        id: "srv_senior_card",
        name: "Senior Citizen Identity Card & Transport Concessions",
        category: "Social Welfare & Identity",
        authority: "Department of Social Justice & Empowerment",
        description: "Official Senior Citizen Card granting priority services, healthcare discounts, and travel benefits.",
        eligibility_conditions: ["Applicant age 60 years or above", "Resident of the issuing State/UT"],
        required_documents: ["Proof of Age (Aadhaar / Passport / Voter ID)", "Proof of Address"],
        official_url: "https://socialjustice.gov.in",
        source_name: "National Portal of India Senior Services",
        verified_date: "2026-09-01",
        evidence_snippet: "Citizens completing 60 years of age qualify for official Senior Citizen status."
      }
    ];

    const urlParams = endpoint.split('query=');
    const query = urlParams.length > 1 ? decodeURIComponent(urlParams[1]).toLowerCase() : '';
    if (query) {
      return mockServices.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.category.toLowerCase().includes(query)
      ) as unknown as T;
    }
    return mockServices as unknown as T;
  }

  return {} as T;
}

function mockJourney(event_type: EventType, user_input: string, context: Record<string, any>, completeFirst = false): Journey {
  const isBirth = event_type === 'CHILD_BIRTH';
  const isDeath = event_type === 'DEATH_IN_FAMILY';

  const tasks = isBirth ? [
    {
      task_id: 'task_cb_1',
      title: 'Hospital Birth Slip & Record Verification',
      description: 'Obtain official Hospital Discharge Summary / Birth Reporting Slip.',
      priority: 1,
      status: completeFirst ? 'COMPLETED' : 'READY',
      dependencies: [],
      required_documents: ['Hospital Birth Slip / Discharge Summary'],
      relevant_service_id: 'srv_birth_reg',
      relevant_service_name: 'Civil Registration System',
      reason: 'Hospital discharge slip contains critical birth timestamp and hospital registration reference number.',
      next_action: 'Upload or verify Hospital Birth Slip document.',
      certainty: 'FACT'
    },
    {
      task_id: 'task_cb_2',
      title: 'Municipal Birth Registration Application',
      description: 'Submit formal birth registration request to local Municipal Registrar.',
      priority: 1,
      status: completeFirst ? 'READY' : 'LOCKED',
      dependencies: ['task_cb_1'],
      required_documents: ['Hospital Birth Slip', 'Parents ID Proof'],
      relevant_service_id: 'srv_birth_reg',
      relevant_service_name: 'Civil Registration System',
      reason: 'Requires verified hospital birth slip before submission to municipal authority.',
      next_action: 'Prepare birth registration application checklist.',
      certainty: 'PROBABLE'
    },
    {
      task_id: 'task_cb_3',
      title: 'Issuance of Official Birth Certificate',
      description: 'Receive and store the digitally signed Official Birth Certificate.',
      priority: 2,
      status: 'LOCKED',
      dependencies: ['task_cb_2'],
      required_documents: ['Registration Receipt'],
      relevant_service_id: 'srv_birth_reg',
      relevant_service_name: 'Civil Registration System',
      reason: 'Official birth certificate is the foundational document required for child benefits.',
      next_action: 'Download and upload verified digital Birth Certificate.',
      certainty: 'PROBABLE'
    },
    {
      task_id: 'task_cb_4',
      title: 'Maternity Benefit Discovery & Eligibility Check',
      description: 'Assess eligibility for PMMVY maternity grant (₹5,000 - ₹6,000 grant).',
      priority: 2,
      status: 'LOCKED',
      dependencies: ['task_cb_3'],
      required_documents: ['Official Birth Certificate', 'Mother Aadhaar'],
      relevant_service_id: 'srv_pmmvy',
      relevant_service_name: 'Pradhan Mantri Matru Vandana Yojana',
      reason: 'PMMVY benefit application requires verified birth certificate details.',
      next_action: 'Review eligibility breakdown for PMMVY.',
      certainty: 'POSSIBLE'
    }
  ] : isDeath ? [
    {
      task_id: 'task_df_1',
      title: 'Medical Death Slip & Registration',
      description: 'Collect Medical Cause of Death certificate / Hospital slip.',
      priority: 1,
      status: 'READY',
      dependencies: [],
      required_documents: ['Medical Death Certificate'],
      relevant_service_id: 'srv_death_cert',
      relevant_service_name: 'Civil Registration System - Death',
      reason: 'Immediate administrative requirement within local municipal timeframe.',
      next_action: 'Verify medical death summary document.',
      certainty: 'FACT'
    },
    {
      task_id: 'task_df_2',
      title: 'Official Death Certificate Issuance',
      description: 'Obtain official legal Death Certificate from local Municipal Corporation.',
      priority: 1,
      status: 'LOCKED',
      dependencies: ['task_df_1'],
      required_documents: ['Medical Death Slip', 'Deceased ID Proof'],
      relevant_service_id: 'srv_death_cert',
      relevant_service_name: 'Civil Registration System',
      reason: 'Official legal death certificate unlocks all financial, pension, bank, and survivor benefits.',
      next_action: 'Submit death registration application.',
      certainty: 'PROBABLE'
    },
    {
      task_id: 'task_df_3',
      title: 'Family Pension & Survivor Benefits Settlement',
      description: 'Initiate pension settlement and Form 14 submission for surviving spouse.',
      priority: 2,
      status: 'LOCKED',
      dependencies: ['task_df_2'],
      required_documents: ['Official Death Certificate', 'Spouse Aadhaar'],
      relevant_service_id: 'srv_family_pension',
      relevant_service_name: 'Family Pension Settlement',
      reason: 'Family pension submission strictly requires official legal Death Certificate.',
      next_action: 'Verify spouse pension details.',
      certainty: 'POSSIBLE'
    }
  ] : [
    {
      task_id: 'task_sc_1',
      title: 'Age & Identity Verification',
      description: 'Verify government age proof to establish senior citizen threshold (60+ years).',
      priority: 1,
      status: 'READY',
      dependencies: [],
      required_documents: ['Aadhaar Card / Passport'],
      relevant_service_id: 'srv_senior_card',
      relevant_service_name: 'Senior Citizen Portal',
      reason: 'First step to confirm official senior citizenship eligibility.',
      next_action: 'Upload age proof document (Aadhaar or Voter ID).',
      certainty: 'FACT'
    },
    {
      task_id: 'task_sc_2',
      title: 'Senior Citizen ID Card Application',
      description: 'Apply for official State Senior Citizen Card for concessions.',
      priority: 1,
      status: 'LOCKED',
      dependencies: ['task_sc_1'],
      required_documents: ['Verified Age Proof', 'Address Proof'],
      relevant_service_id: 'srv_senior_card',
      relevant_service_name: 'Social Welfare Portal',
      reason: 'Requires verified age and residency proof.',
      next_action: 'Prepare Senior Citizen Card checklist.',
      certainty: 'PROBABLE'
    }
  ];

  const next_best_task = tasks.find(t => t.status === 'READY') || tasks[0];

  return {
    id: `jrn_${event_type.toLowerCase()}_demo`,
    event_type,
    title: isBirth ? 'Newborn Child Birth Guided Journey' : isDeath ? 'Family Member Demise Administrative Journey' : 'Senior Citizenship Concessions & Pension Journey',
    user_input: user_input || 'We had a baby yesterday',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    context: context || { state: 'Maharashtra' },
    progress_percentage: completeFirst ? 25 : 0,
    tasks: tasks as any,
    next_best_action: {
      action_title: `Execute: ${next_best_task.title}`,
      description: next_best_task.next_action,
      target_task_id: next_best_task.task_id,
      reasoning: `Task '${next_best_task.title}' is currently unlocked and has highest priority. Reason: ${next_best_task.reason}`,
      urgency: 'High',
      requires_approval: true,
      proposed_payload: { task_id: next_best_task.task_id }
    },
    activities: [
      { id: 'a1', timestamp: '10:42:01', agent_name: 'Life Event Classification Agent', message: `Identified event '${event_type}'`, status: 'COMPLETED' },
      { id: 'a2', timestamp: '10:42:03', agent_name: 'Context Collection Agent', message: 'Collected minimum context parameters', status: 'COMPLETED' },
      { id: 'a3', timestamp: '10:42:05', agent_name: 'Life Event Planner', message: `Built ${tasks.length} dependency-aware tasks`, status: 'COMPLETED' },
      { id: 'a4', timestamp: '10:42:07', agent_name: 'Dependency Engine', message: 'Evaluated initial task graph status', status: 'COMPLETED' },
      { id: 'a5', timestamp: '10:42:09', agent_name: 'Next Best Action Agent', message: `Selected top action '${next_best_task.title}'`, status: 'READY' }
    ]
  };
}

export const api = {
  classifyEvent: (user_input: string) => fetchJSON<any>('/events/classify', { method: 'POST', body: JSON.stringify({ user_input }) }),
  getContextQuestions: (event_type: EventType, context_answers: Record<string, any>) => fetchJSON<any>('/events/context', { method: 'POST', body: JSON.stringify({ event_type, context_answers }) }),
  createJourney: (event_type: EventType, user_input: string, context: Record<string, any>) => fetchJSON<Journey>('/journey/create', { method: 'POST', body: JSON.stringify({ event_type, user_input, context }) }),
  getJourney: (id: string) => fetchJSON<Journey>(`/journey/${id}`),
  getNextAction: (id: string) => fetchJSON<any>(`/journey/${id}/next-action`, { method: 'POST' }),
  completeTask: (journey_id: string, task_id: string) => fetchJSON<Journey>(`/journey/${journey_id}/tasks/${task_id}/complete`, { method: 'POST' }),
  searchServices: (query: string) => fetchJSON<GovernmentService[]>(`/services/search?query=${encodeURIComponent(query)}`),
  checkEligibility: (service_id: string, context: Record<string, any>) => fetchJSON<EligibilityAssessment>('/eligibility/check', { method: 'POST', body: JSON.stringify({ service_id, context }) }),
  analyzeDocument: (file_name: string, type_hint: string) => fetchJSON<DocumentAnalysisResponse>('/documents/analyze', { method: 'POST', body: JSON.stringify({ file_name, document_type_hint: type_hint }) }),
  approveAction: (action_id: string) => fetchJSON<AgentAction>(`/actions/${action_id}/approve`, { method: 'POST' }),
  getHistory: () => fetchJSON<Journey[]>('/history'),
  getFrictionAnalytics: () => fetchJSON<any>('/analytics/friction')
};
