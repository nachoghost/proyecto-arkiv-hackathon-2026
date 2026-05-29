import type { ClinicalEventRecord } from "./types";
import { EVENT_TYPE_LABELS, HOSPITALS } from "./constants";

function hospitalName(id: string) {
  return HOSPITALS.find((h) => h.id === id)?.name ?? id;
}

/** Resumen determinista cuando no hay API de IA */
export function buildRuleBasedSummary(
  patientId: string,
  events: ClinicalEventRecord[],
): string {
  if (events.length === 0) {
    return `Paciente ${patientId}: sin eventos clínicos verificables en Arkiv (Braga).`;
  }

  const allergies = events.filter((e) => e.eventType === "allergy");
  const admissions = events.filter((e) => e.eventType === "admission");
  const lines: string[] = [
    `Resumen de urgencias — ${patientId}`,
    `Basado en ${events.length} evento(s) verificable(s) on-chain.`,
    "",
  ];

  if (allergies.length > 0) {
    lines.push(
      "⚠ Alergias:",
      ...allergies.map((e) => `  • ${e.summary} (${hospitalName(e.hospitalId)})`),
      "",
    );
  }

  if (admissions.length > 0) {
    const last = admissions[0];
    lines.push(
      `Último ingreso: ${last.summary} — ${hospitalName(last.hospitalId)} (${last.timestamp}).`,
      "",
    );
  }

  lines.push("Timeline reciente:");
  for (const e of events.slice(0, 5)) {
    const tipo = EVENT_TYPE_LABELS[e.eventType] ?? e.eventType;
    lines.push(
      `  • [${tipo}] ${e.summary} — ${hospitalName(e.hospitalId)}`,
    );
  }

  return lines.join("\n");
}

export async function buildAiSummary(
  patientId: string,
  events: ClinicalEventRecord[],
): Promise<{ text: string; source: "openai" | "rules" }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      text: buildRuleBasedSummary(patientId, events),
      source: "rules",
    };
  }

  const context = events.map((e) => ({
    eventType: e.eventType,
    summary: e.summary,
    hospitalId: e.hospitalId,
    timestamp: e.timestamp,
    entityKey: e.entityKey,
  }));

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "Sos un asistente clínico para handoff en urgencias. Resumí en español, máximo 12 líneas. Solo usá los eventos del JSON; no inventes diagnósticos. Mencioná alergias primero si existen.",
        },
        {
          role: "user",
          content: `Paciente: ${patientId}\nEventos verificados en Arkiv:\n${JSON.stringify(context, null, 2)}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    return {
      text: buildRuleBasedSummary(patientId, events),
      source: "rules",
    };
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) {
    return {
      text: buildRuleBasedSummary(patientId, events),
      source: "rules",
    };
  }

  return { text, source: "openai" };
}
