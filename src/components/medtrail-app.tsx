"use client";

import { useCallback, useState, useEffect } from "react";

import {
  DEMO_PATIENTS,
  EVENT_TYPE_LABELS,
  EXPLORER_TX_BASE,
  ENTITY_EXPLORER_BASE,
  FAUCET_URL,
  HOSPITALS,
} from "@/lib/constants";
import type { ClinicalEventRecord, EventType } from "@/lib/types";
import { SearchBar } from "@/components/medical/search-bar";
import { FilterChips } from "@/components/medical/filter-chips";
import { ClinicalSummary } from "@/components/medical/clinical-summary";
import { MedicalTimeline } from "@/components/medical/medical-timeline";
import { CreateRecordForm } from "@/components/medical/create-record-form";
import { RecordDetailsModal } from "@/components/medical/record-details-modal";

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

export function MedtrailApp({ onLogout }: { onLogout?: () => void }) {
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

  // Patient data state
  const [patientData, setPatientData] = useState({
    admissionDate: "29/05/2026",
    admissionType: "Guardia",
    doctor: "Dr. Pérez",
    allergies: ["Penicilina", "AINes"],
    diagnosis: "Hipertensión · seguimiento",
    status: "Estable",
  });

  const [isEditingPatient, setIsEditingPatient] = useState(false);
  const [editPatientData, setEditPatientData] = useState(patientData);

  // New medical record interface state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"quick" | "complete">("quick");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [pinnedRecords, setPinnedRecords] = useState<Set<string>>(new Set());

  // Filter events based on search query and active filter
  const filteredEvents = events.filter((ev) => {
    // Try to parse structured record type from summary
    let recordType: string | null = null;
    try {
      if (typeof ev.summary === "string") {
        const parsed = JSON.parse(ev.summary);
        if (parsed && parsed.type === "structured_record" && parsed.recordType) {
          recordType = parsed.recordType;
        }
      }
    } catch {
      // Not a structured record or invalid JSON
    }

    const matchesSearch = searchQuery === "" ||
      (typeof ev.summary === "string" && ev.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
      EVENT_TYPE_LABELS[ev.eventType].toLowerCase().includes(searchQuery.toLowerCase()) ||
      HOSPITALS.find((h) => h.id === ev.hospitalId)?.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = activeFilter === "all" ||
      (activeFilter === "consultations" && (ev.eventType === "note" || recordType === "consultation")) ||
      (activeFilter === "hospitalizations" && (ev.eventType === "admission" || recordType === "hospitalization")) ||
      (activeFilter === "surgeries" && recordType === "surgery") ||
      (activeFilter === "studies" && (ev.eventType === "lab" || recordType === "study")) ||
      (activeFilter === "medications" && recordType === "medication") ||
      (activeFilter === "allergies" && (ev.eventType === "allergy" || recordType === "allergy")) ||
      (activeFilter === "documents" && (ev.eventType === "note" || recordType === "document")) ||
      (activeFilter === "pending" && false) ||
      (activeFilter === "verified" && true);

    return matchesSearch && matchesFilter;
  });

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

      // Try to load patient data from events
      const patientDataEvent = data.events?.find((ev: ClinicalEventRecord) => {
        try {
          const parsed = JSON.parse(ev.summary);
          return parsed.type === "patient_data";
        } catch {
          return false;
        }
      });

      if (patientDataEvent) {
        try {
          const parsed = JSON.parse(patientDataEvent.summary);
          if (parsed.data) {
            setPatientData(parsed.data);
            setEditPatientData(parsed.data);
          }
        } catch (e) {
          console.error("Error parsing patient data from event:", e);
        }
      }
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

  // Load events on mount
  useEffect(() => {
    void loadEvents(patientId);
  }, [patientId, loadEvents]);

  // Real-time updates - poll every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      void loadEvents(patientId);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [patientId, loadEvents]);

  const handleSavePatientData = async () => {
    setPatientData(editPatientData);
    setIsEditingPatient(false);

    // Save patient data to Arkiv as a note event
    try {
      const patientDataEvent = {
        patientId,
        hospitalId,
        eventType: "note" as EventType,
        summary: JSON.stringify({
          type: "patient_data",
          data: editPatientData,
        }),
      };

      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patientDataEvent),
      });

      if (res.ok) {
        const data = await res.json();
        setLastTx({ txHash: data.txHash, entityKey: data.entityKey });
        await loadEvents(patientId);
      }
    } catch (err) {
      console.error("Error saving patient data to Arkiv:", err);
    }
  };

  const handleCancelEdit = () => {
    setEditPatientData(patientData);
    setIsEditingPatient(false);
  };

  const handleAddAllergy = () => {
    const allergy = prompt("Nueva alergia:");
    if (allergy && allergy.trim()) {
      setEditPatientData({
        ...editPatientData,
        allergies: [...editPatientData.allergies, allergy.trim()],
      });
    }
  };

  const handleRemoveAllergy = (index: number) => {
    setEditPatientData({
      ...editPatientData,
      allergies: editPatientData.allergies.filter((_, i) => i !== index),
    });
  };

  const handlePinRecord = (recordId: string) => {
    const newPinned = new Set(pinnedRecords);
    if (newPinned.has(recordId)) {
      newPinned.delete(recordId);
    } else {
      newPinned.add(recordId);
    }
    setPinnedRecords(newPinned);
  };

  const handleViewRecordDetails = (recordId: string) => {
    const record = events.find((e) => e.entityKey === recordId);
    if (record) {
      setSelectedRecord({
        id: record.entityKey,
        title: EVENT_TYPE_LABELS[record.eventType],
        type: record.eventType,
        date: new Date(record.timestamp).toLocaleDateString("es-AR"),
        institution: HOSPITALS.find((h) => h.id === record.hospitalId)?.name,
        status: "verified",
        description: record.summary,
      });
    }
  };

  const handleCreateRecord = async (data: any) => {
    setLoading(true);
    setError(null);
    setLastTx(null);

    try {
      // Convert new record format to existing event format
      const summary = JSON.stringify({
        type: "structured_record",
        ...data,
      });

      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId,
          hospitalId,
          eventType: "note" as EventType,
          summary,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error ?? "Error al registrar");
      }

      const responseData = await res.json();
      setLastTx({ txHash: responseData.txHash, entityKey: responseData.entityKey });
      await loadEvents(patientId);
      setShowCreateForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
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
      <header className="border-b border-med-line bg-med-primary">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer font-fraunces text-[23px] font-semibold tracking-[-0.02em]">
              <span className="w-[34px] h-[34px] rounded-[9px] bg-med-ink grid place-items-center flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="#16B886" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <rect x="4" y="3" width="12" height="18" rx="2"/>
                  <path d="M10 3V7"/>
                  <path d="M8 7H12"/>
                  <path d="M8 11H14"/>
                  <path d="M8 15H14"/>
                  <path d="M8 19H12"/>
                  <path d="M16 8C16 6.89543 16.8954 6 18 6C19.1046 6 20 6.89543 20 8V16C20 17.1046 19.1046 18 18 18C16.8954 18 16 17.1046 16 16"/>
                  <path d="M16 8V16"/>
                  <circle cx="18" cy="12" r="2"/>
                </svg>
              </span>
              InforMed
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                className="rounded-lg border border-med-line-strong bg-med-surface-elevated px-4 py-2 text-sm text-med-text hover:border-med-secondary/50"
              >
                Cerrar sesión
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl gap-8 px-4 py-8">
        {/* Patient Card */}
        <div className="bg-white border border-med-line rounded-[20px] shadow-[0_24px_60px_-28px_rgba(14,46,41,.45)] p-6 mb-8">
          {/* Patient Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-dashed border-med-line">
            <div className="w-[46px] h-[46px] rounded-[13px] bg-gradient-to-br from-med-ink to-med-secondary text-white grid place-items-center font-fraunces text-[18px] flex-shrink-0">
              {DEMO_PATIENTS.find((p) => p.id === patientId)?.label.split(" ")[0]?.substring(0, 2).toUpperCase() || "MG"}
            </div>
            <div>
              <b className="text-[15.5px] block">{DEMO_PATIENTS.find((p) => p.id === patientId)?.label || "María González"}</b>
              <span className="text-[12.5px] text-med-muted">HC {patientId} · 47 años · F</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-med-secondary bg-med-secondary-soft px-2.5 py-1 rounded-[999px] whitespace-nowrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                  <path d="M20 6 9 17l-5-5"/>
                </svg>
                Verificado
              </div>
              <button
                onClick={() => setIsEditingPatient(!isEditingPatient)}
                className="text-[11px] font-semibold text-med-secondary hover:text-med-ink-soft"
              >
                {isEditingPatient ? "Cancelar" : "Editar"}
              </button>
            </div>
          </div>

          {/* Patient Info Rows - View Mode */}
          {!isEditingPatient ? (
            <>
              <div className="flex justify-between items-start py-3 border-b border-med-line">
                <span className="text-[11.5px] uppercase tracking-[0.08em] text-med-muted font-semibold">Ingreso</span>
                <span className="text-[14.5px] text-right max-w-[62%]">{patientData.admissionDate} · {patientData.admissionType} · {patientData.doctor}</span>
              </div>
              <div className="flex justify-between items-start py-3 border-b border-med-line">
                <span className="text-[11.5px] uppercase tracking-[0.08em] text-med-muted font-semibold">Alergias</span>
                <span className="text-[14.5px] text-right max-w-[62%]">
                  <div className="flex gap-1.5 flex-wrap justify-end">
                    {patientData.allergies.map((allergy, i) => (
                      <span key={i} className="text-[11.5px] font-semibold px-2.5 py-0.5 rounded-[999px] bg-[rgba(224,101,76,.13)] text-med-coral">{allergy}</span>
                    ))}
                  </div>
                </span>
              </div>
              <div className="flex justify-between items-start py-3 border-b border-med-line">
                <span className="text-[11.5px] uppercase tracking-[0.08em] text-med-muted font-semibold">Diagnóstico</span>
                <span className="text-[14.5px] text-right max-w-[62%]">{patientData.diagnosis}</span>
              </div>
              <div className="flex justify-between items-start py-3">
                <span className="text-[11.5px] uppercase tracking-[0.08em] text-med-muted font-semibold">Estado</span>
                <span className="text-[14.5px] text-right max-w-[62%]">
                  <div className="flex gap-1.5 flex-wrap justify-end">
                    <span className="text-[11.5px] font-semibold px-2.5 py-0.5 rounded-[999px] bg-[rgba(14,140,107,.12)] text-med-secondary">{patientData.status}</span>
                  </div>
                </span>
              </div>
            </>
          ) : (
            /* Edit Mode */
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11.5px] uppercase tracking-[0.08em] text-med-muted font-semibold mb-1">Fecha de ingreso</label>
                  <input
                    type="date"
                    value={editPatientData.admissionDate}
                    onChange={(e) => setEditPatientData({ ...editPatientData, admissionDate: e.target.value })}
                    className="w-full px-3 py-2 border border-med-line rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11.5px] uppercase tracking-[0.08em] text-med-muted font-semibold mb-1">Tipo de ingreso</label>
                  <select
                    value={editPatientData.admissionType}
                    onChange={(e) => setEditPatientData({ ...editPatientData, admissionType: e.target.value })}
                    className="w-full px-3 py-2 border border-med-line rounded-lg text-sm"
                  >
                    <option value="Guardia">Guardia</option>
                    <option value="Programado">Programado</option>
                    <option value="Urgencia">Urgencia</option>
                    <option value="Traslado">Traslado</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[11.5px] uppercase tracking-[0.08em] text-med-muted font-semibold mb-1">Doctor</label>
                <input
                  type="text"
                  value={editPatientData.doctor}
                  onChange={(e) => setEditPatientData({ ...editPatientData, doctor: e.target.value })}
                  className="w-full px-3 py-2 border border-med-line rounded-lg text-sm"
                  placeholder="Dr. Pérez"
                />
              </div>
              <div>
                <label className="block text-[11.5px] uppercase tracking-[0.08em] text-med-muted font-semibold mb-1">Alergias</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editPatientData.allergies.map((allergy, i) => (
                    <span key={i} className="text-[11.5px] font-semibold px-2.5 py-0.5 rounded-[999px] bg-[rgba(224,101,76,.13)] text-med-coral flex items-center gap-1">
                      {allergy}
                      <button onClick={() => handleRemoveAllergy(i)} className="text-med-coral hover:text-med-ink">×</button>
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleAddAllergy}
                  className="text-xs text-med-secondary hover:text-med-ink-soft"
                >
                  + Agregar alergia
                </button>
              </div>
              <div>
                <label className="block text-[11.5px] uppercase tracking-[0.08em] text-med-muted font-semibold mb-1">Diagnóstico</label>
                <input
                  type="text"
                  value={editPatientData.diagnosis}
                  onChange={(e) => setEditPatientData({ ...editPatientData, diagnosis: e.target.value })}
                  className="w-full px-3 py-2 border border-med-line rounded-lg text-sm"
                  placeholder="Hipertensión · seguimiento"
                />
              </div>
              <div>
                <label className="block text-[11.5px] uppercase tracking-[0.08em] text-med-muted font-semibold mb-1">Estado</label>
                <select
                  value={editPatientData.status}
                  onChange={(e) => setEditPatientData({ ...editPatientData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-med-line rounded-lg text-sm"
                >
                  <option value="Estable">Estable</option>
                  <option value="Crítico">Crítico</option>
                  <option value="Mejorando">Mejorando</option>
                  <option value="Empeorando">Empeorando</option>
                  <option value="Alta">Alta</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSavePatientData}
                  className="flex-1 px-4 py-2 bg-med-secondary text-white text-sm font-semibold rounded-lg hover:bg-med-secondary-hover"
                >
                  Guardar cambios
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 px-4 py-2 border border-med-line text-sm font-semibold rounded-lg hover:bg-med-surface-elevated"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Arkiv Block Info */}
          {lastTx && (
            <div className="mt-4 font-mono text-[11px] text-med-muted bg-med-primary rounded-[10px] px-3 py-2 flex items-center gap-2 border border-med-line">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 text-med-secondary flex-shrink-0">
                <path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/>
              </svg>
              {lastTx.entityKey.substring(0, 10)}…{lastTx.entityKey.substring(lastTx.entityKey.length - 4)} · bloque #1,284,907 · Arkiv
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Controls */}
          <section className="space-y-6">
            <div className={cardClass}>
              <h2 className="text-sm font-semibold text-med-text">
                Panel de médico
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

            <button
              type="button"
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="w-full rounded-xl border border-med-secondary/25 bg-med-secondary-soft px-4 py-3 text-sm font-medium text-med-secondary hover:bg-med-secondary-soft/80"
            >
              {showCreateForm ? "Cancelar" : "+ Nuevo registro médico"}
            </button>

            {showCreateForm && (
              <CreateRecordForm
                onSubmit={handleCreateRecord}
                onCancel={() => setShowCreateForm(false)}
              />
            )}

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

          {/* Right Column - New Medical Timeline */}
          <section className="space-y-6">
            {/* View Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("quick")}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === "quick"
                    ? "bg-med-secondary text-white"
                    : "bg-white border border-med-line text-med-muted"
                }`}
              >
                Vista rápida
              </button>
              <button
                onClick={() => setViewMode("complete")}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === "complete"
                    ? "bg-med-secondary text-white"
                    : "bg-white border border-med-line text-med-muted"
                }`}
              >
                Vista completa
              </button>
            </div>

            {viewMode === "complete" && (
              <>
                <SearchBar onSearch={setSearchQuery} />
                <FilterChips activeFilter={activeFilter} onFilterChange={setActiveFilter} />
              </>
            )}

            {/* Clinical Summary (Quick View) */}
            {viewMode === "quick" && (
              <ClinicalSummary
                data={{
                  allergies: patientData.allergies,
                  currentMedication: [],
                  relevantHistory: [patientData.diagnosis],
                  lastHospitalizations: [
                    {
                      date: patientData.admissionDate,
                      reason: patientData.admissionType,
                      institution: "Hospital Central",
                    },
                  ],
                  importantSurgeries: [],
                  pendingDocuments: [],
                  clinicalAlerts: patientData.allergies.length > 0 ? ["Alergias importantes detectadas"] : [],
                }}
              />
            )}

            {/* Timeline */}
            <div className={cardClass}>
              <div className="flex items-baseline justify-between gap-2 mb-4">
                <h2 className="text-sm font-semibold text-med-text">
                  Timeline verificable
                </h2>
                {events.length > 0 && (
                  <span className="text-xs text-med-muted">
                    {events.length} evento{events.length !== 1 ? "s" : ""}
                  </span>
                )}
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

              <MedicalTimeline
                records={filteredEvents.map((ev) => {
                  // Try to get better title from structured record
                  let title = EVENT_TYPE_LABELS[ev.eventType] ?? ev.eventType;
                  let type = ev.eventType;
                  try {
                    if (typeof ev.summary === "string") {
                      const parsed = JSON.parse(ev.summary);
                      if (parsed && parsed.type === "structured_record") {
                        if (parsed.recordType === "medication") {
                          title = parsed.substance || "Medicación";
                          type = "medication";
                        } else if (parsed.recordType === "surgery") {
                          title = parsed.procedure || "Cirugía";
                          type = "surgery";
                        } else if (parsed.recordType === "allergy") {
                          title = parsed.substance || "Alergia";
                          type = "allergy";
                        }
                      }
                    }
                  } catch {
                    // Not a structured record or invalid JSON
                  }

                  return {
                    id: ev.entityKey,
                    title,
                    type: type as any, // Allow structured record types
                    date: new Date(ev.timestamp).toLocaleDateString("es-AR"),
                    institution: HOSPITALS.find((h) => h.id === ev.hospitalId)?.name,
                    status: "verified",
                    isPinned: pinnedRecords.has(ev.entityKey),
                  };
                })}
                onPin={handlePinRecord}
                onViewDetails={handleViewRecordDetails}
              />
            </div>
          </section>
        </div>

        {/* Record Details Modal */}
        {selectedRecord && (
          <RecordDetailsModal
            record={selectedRecord}
            onClose={() => setSelectedRecord(null)}
          />
        )}
      </main>

      <footer className="border-t border-med-line bg-med-primary py-6 text-center text-xs text-med-muted">
        Datos sintéticos · Sin PHI real · Red Braga
      </footer>
    </div>
  );
}
