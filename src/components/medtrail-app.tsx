"use client";

import { useCallback, useState } from "react";

import {
  DEMO_PATIENTS,
  EVENT_TYPE_LABELS,
  EXPLORER_TX_BASE,
  ENTITY_EXPLORER_BASE,
  FAUCET_URL,
  HOSPITALS,
} from "@/lib/constants";
import type { ClinicalEventRecord, EventType } from "@/lib/types";

const EVENT_TYPES: EventType[] = [
  "allergy",
  "admission",
  "discharge",
  "lab",
  "note",
];

const inputClass =
  "mt-1 w-full rounded-lg border-2 border-med-secondary/35 bg-med-surface-elevated px-3 py-2 text-sm text-med-text focus:border-med-secondary focus:outline-none focus:ring-1 focus:ring-med-secondary";

const cardClass =
  "rounded-xl border-2 border-med-secondary/25 bg-med-primary p-5";

export function MedtrailApp() {
  const [hospitalId, setHospitalId] = useState<string>(HOSPITALS[0].id);
  const [patientId, setPatientId] = useState<string>(DEMO_PATIENTS[0].id);
  const [eventType, setEventType] = useState<EventType>("allergy");
  const [summary, setSummary] = useState("");
  const [events, setEvents] = useState<ClinicalEventRecord[]>([]);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [summarySource, setSummarySource] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTx, setLastTx] = useState<{
    txHash: string;
    entityKey: string;
  } | null>(null);

  const loadEvents = useCallback(async (pid: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/events?patientId=${encodeURIComponent(pid)}`,
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al cargar");
      setEvents(data.events ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePatientChange = (pid: string) => {
    setPatientId(pid);
    setAiSummary(null);
    setSummarySource(null);
    void loadEvents(pid);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setLastTx(null);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId,
          hospitalId,
          eventType,
          summary,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al registrar");
      setLastTx({ txHash: data.txHash, entityKey: data.entityKey });
      setSummary("");
      await loadEvents(patientId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleSummary = async () => {
    setSummaryLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al resumir");
      setAiSummary(data.summary);
      setSummarySource(data.source);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-med-primary text-med-text">
      <header className="border-b-2 border-med-secondary/30 bg-med-primary">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <p className="text-xs font-medium uppercase tracking-widest text-med-secondary">
            Puna Tech 2026 · Track Arkiv
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-med-text">
            MedTrail
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-med-muted">
            Timeline clínico verificable entre hospitales locales. Cada evento es
            una entidad en{" "}
            <span className="font-medium text-med-secondary">Braga</span> —
            auditable, sin UPDATE silencioso.
          </p>
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-8 px-4 py-8 lg:grid-cols-2">
        <section className="space-y-6">
          <div className={cardClass}>
            <h2 className="text-sm font-semibold text-med-text">
              Contexto de demo
            </h2>
            <label className="mt-4 block text-xs text-med-muted">
              Hospital (vosotros sois este nodo)
            </label>
            <select
              className={inputClass}
              value={hospitalId}
              onChange={(e) => setHospitalId(e.target.value)}
            >
              {HOSPITALS.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>

            <label className="mt-4 block text-xs text-med-muted">Paciente</label>
            <select
              className={inputClass}
              value={patientId}
              onChange={(e) => handlePatientChange(e.target.value)}
            >
              {DEMO_PATIENTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => void loadEvents(patientId)}
              disabled={loading}
              className="mt-4 w-full rounded-lg border-2 border-med-secondary/30 bg-med-surface-elevated px-3 py-2 text-sm text-med-text hover:border-med-secondary/50 disabled:opacity-50"
            >
              {loading ? "Cargando…" : "Actualizar timeline desde Arkiv"}
            </button>
          </div>

          <form onSubmit={handleSubmit} className={cardClass}>
            <h2 className="text-sm font-semibold text-med-text">
              Registrar evento clínico
            </h2>

            <label className="mt-4 block text-xs text-med-muted">Tipo</label>
            <select
              className={inputClass}
              value={eventType}
              onChange={(e) => setEventType(e.target.value as EventType)}
            >
              {EVENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {EVENT_TYPE_LABELS[t]}
                </option>
              ))}
            </select>

            <label className="mt-4 block text-xs text-med-muted">Resumen</label>
            <textarea
              className={inputClass}
              rows={3}
              placeholder="Ej: Alergia a penicilina — reacción leve"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading || !summary.trim()}
              className="mt-4 w-full rounded-lg bg-med-secondary px-3 py-2 text-sm font-medium text-white hover:bg-med-secondary-hover disabled:opacity-50"
            >
              Publicar en Arkiv (createEntity)
            </button>
          </form>

          {lastTx && (
            <div className="rounded-xl border border-med-secondary/30 bg-med-secondary-soft p-4 text-xs">
              <p className="font-medium text-med-secondary">Última transacción</p>
              <p className="mt-2 break-all text-med-muted">
                entityKey: {lastTx.entityKey}
              </p>
              <div className="mt-2 flex flex-wrap gap-3">
                <a
                  href={`${EXPLORER_TX_BASE}${lastTx.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-med-secondary underline"
                >
                  Ver tx en explorer
                </a>
                <a
                  href={`${ENTITY_EXPLORER_BASE}${lastTx.entityKey}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-med-secondary underline"
                >
                  Ver entidad
                </a>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => void handleSummary()}
            disabled={summaryLoading}
            className="w-full rounded-xl border border-med-secondary/25 bg-med-secondary-soft px-4 py-3 text-sm font-medium text-med-secondary hover:bg-med-secondary-soft/80 disabled:opacity-50"
          >
            {summaryLoading
              ? "Generando resumen…"
              : "Resumen urgencias (IA + datos Arkiv)"}
          </button>

          {aiSummary && (
            <div className="rounded-xl border border-med-secondary/20 bg-med-secondary-soft/60 p-4">
              <p className="text-xs text-med-secondary">
                Fuente: {summarySource === "openai" ? "OpenAI" : "reglas locales"}
                {summarySource === "rules" && " (añadí OPENAI_API_KEY para IA)"}
              </p>
              <pre className="mt-2 whitespace-pre-wrap text-sm text-med-text">
                {aiSummary}
              </pre>
            </div>
          )}
        </section>

        <section
          className={`flex max-h-[min(32rem,calc(100vh-10rem))] flex-col lg:sticky lg:top-6 lg:max-h-[calc(100vh-7rem)] ${cardClass}`}
        >
          <div className="shrink-0">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="text-sm font-semibold text-med-text">
                Timeline verificable
              </h2>
              {events.length > 0 && (
                <span className="text-xs text-med-muted">
                  {events.length} evento{events.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-med-muted">
              Consulta por{" "}
              <code className="text-med-secondary">patientId</code> vía{" "}
              <code className="text-med-secondary">arkiv_query</code>
            </p>
          </div>

          {error && (
            <div className="mt-4 shrink-0 rounded-lg border-2 border-red-300/50 bg-med-surface-elevated p-3 text-sm text-red-900">
              {error}
              {error.includes("PRIVATE_KEY") && (
                <p className="mt-2">
                  <a
                    href={FAUCET_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    Faucet Braga (GLM)
                  </a>
                </p>
              )}
            </div>
          )}

          <ul className="mt-4 min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain pr-1 scrollbar-thin">
            {events.length === 0 && !loading && (
              <li className="text-sm text-med-muted">
                Sin eventos. Registrá uno o ejecutá{" "}
                <code className="text-med-text">npm run seed</code>.
              </li>
            )}
            {events.map((ev) => (
              <li
                key={ev.entityKey}
                className="rounded-lg border-2 border-med-secondary/20 bg-med-secondary-soft/50 p-4"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded bg-med-secondary-soft px-2 py-0.5 font-medium text-med-secondary">
                    {EVENT_TYPE_LABELS[ev.eventType] ?? ev.eventType}
                  </span>
                  <span className="text-med-muted">
                    {HOSPITALS.find((h) => h.id === ev.hospitalId)?.name ??
                      ev.hospitalId}
                  </span>
                </div>
                <p className="mt-2 text-sm text-med-text">{ev.summary}</p>
                <p className="mt-1 text-xs text-med-muted">
                  {new Date(ev.timestamp).toLocaleString("es-AR")}
                </p>
                <a
                  href={`${ENTITY_EXPLORER_BASE}${ev.entityKey}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-xs font-medium text-med-secondary underline"
                >
                  Verificar entidad
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t-2 border-med-secondary/30 bg-med-primary py-6 text-center text-xs text-med-muted">
        Datos sintéticos · Sin PHI real · Red Braga
      </footer>
    </div>
  );
}
