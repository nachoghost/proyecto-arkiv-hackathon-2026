import { config } from "dotenv";

import { createClinicalEvent } from "../src/lib/arkiv";
import type { ClinicalEventPayload } from "../src/lib/types";

const seeds: ClinicalEventPayload[] = [
  {
    patientId: "demo-001",
    hospitalId: "hospital-norte",
    eventType: "allergy",
    summary: "Alergia a penicilina — urticaria leve (2022)",
    timestamp: "2026-05-27T10:00:00.000Z",
  },
  {
    patientId: "demo-001",
    hospitalId: "hospital-sur",
    eventType: "admission",
    summary: "Ingreso urgencias — dolor torácico atípico, observación 6h",
    timestamp: "2026-05-28T08:30:00.000Z",
  },
  {
    patientId: "demo-002",
    hospitalId: "hospital-centro",
    eventType: "lab",
    summary: "Hemograma dentro de rango normal",
    timestamp: "2026-05-26T14:00:00.000Z",
  },
];

async function main() {
  config();

  for (const payload of seeds) {
    const { entityKey, txHash } = await createClinicalEvent(payload);
    console.log(`✓ ${payload.patientId} / ${payload.eventType}`);
    console.log(`  ${entityKey} — ${txHash}`);
  }

  console.log("\nListo. Abrí http://localhost:3000 y elegí demo-001.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
