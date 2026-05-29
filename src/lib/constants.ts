export const BRAGA_RPC = "https://braga.hoodi.arkiv.network/rpc";
export const EXPLORER_TX_BASE =
  "https://explorer.braga.hoodi.arkiv.network/tx/";
export const ENTITY_EXPLORER_BASE = "https://data.arkiv.network/entity/";
export const FAUCET_URL = "https://braga.hoodi.arkiv.network/faucet";

export const ENTITY_TYPE_CLINICAL = "clinical_event";
export const ENTITY_TYPE_AI_SUMMARY = "ai_summary";
export const EVENT_STATUS_ACTIVE = "active";

/** 7 días — suficiente para la hackathon */
export const DEFAULT_EXPIRES_IN_SECONDS = 604800;

export const HOSPITALS = [
  { id: "hospital-norte", name: "Hospital Norte" },
  { id: "hospital-sur", name: "Hospital Sur" },
  { id: "hospital-centro", name: "Hospital Centro" },
] as const;

export const DEMO_PATIENTS = [
  { id: "demo-001", label: "Paciente Demo 1 (María G.)" },
  { id: "demo-002", label: "Paciente Demo 2 (Juan P.)" },
  { id: "demo-003", label: "Paciente Demo 3 (Ana L.)" },
] as const;

export const EVENT_TYPE_LABELS: Record<string, string> = {
  allergy: "Alergia",
  admission: "Ingreso",
  discharge: "Alta",
  lab: "Laboratorio",
  note: "Nota clínica",
};
