export type EventType =
  | "allergy"
  | "admission"
  | "discharge"
  | "lab"
  | "note";

export type ValidationStatus =
  | "declared"
  | "document_attached"
  | "ai_extracted"
  | "pending_review"
  | "verified"
  | "institution_issued"
  | "corrected"
  | "discarded";

export interface ClinicalEventPayload {
  patientId: string;
  hospitalId: string;
  eventType: EventType;
  summary: string;
  timestamp: string;
}

export interface ClinicalEventRecord extends ClinicalEventPayload {
  entityKey: string;
  txHash?: string;
  creator?: string;
}

export interface CreateEventBody {
  patientId: string;
  hospitalId: string;
  eventType: EventType;
  summary: string;
}
