import { NextResponse } from "next/server";

import { queryClinicalEvents } from "@/lib/arkiv";
import { buildAiSummary } from "@/lib/summary";

export async function POST(request: Request) {
  let patientId: string | undefined;
  try {
    const body = (await request.json()) as { patientId?: string };
    patientId = body.patientId;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (!patientId) {
    return NextResponse.json(
      { error: "patientId es requerido" },
      { status: 400 },
    );
  }

  try {
    const events = await queryClinicalEvents(patientId);
    const { text, source } = await buildAiSummary(patientId, events);
    return NextResponse.json({
      summary: text,
      source,
      eventCount: events.length,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error al generar resumen";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
