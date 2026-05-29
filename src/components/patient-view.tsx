"use client";

import { useState, useEffect, useCallback } from "react";
import { DEMO_PATIENTS, EVENT_TYPE_LABELS, HOSPITALS } from "@/lib/constants";
import type { ClinicalEventRecord } from "@/lib/types";
import { SearchBar } from "@/components/medical/search-bar";
import { FilterChips } from "@/components/medical/filter-chips";
import { ClinicalSummary } from "@/components/medical/clinical-summary";
import { MedicalTimeline } from "@/components/medical/medical-timeline";
import { RecordDetailsModal } from "@/components/medical/record-details-modal";

export function PatientView({ onLogout }: { onLogout?: () => void }) {
  const [patientId] = useState<string>(DEMO_PATIENTS[0].id);
  const [patientData, setPatientData] = useState({
    name: "María González",
    hc: "04821",
    age: 47,
    gender: "F",
    admissionDate: "29/05/2026",
    admissionType: "Guardia",
    doctor: "Dr. Pérez",
    allergies: ["Penicilina", "AINes"],
    diagnosis: "Hipertensión · seguimiento",
    status: "Estable",
    documents: [] as Array<{
      id: string;
      name: string;
      date: string;
      location: string;
      doctor: string;
      status: "prestado" | "pendiente" | "cargado";
      signature?: string;
      pdfUrl?: string;
    }>,
  });

  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [events, setEvents] = useState<ClinicalEventRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"quick" | "complete">("quick");
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

  const loadPatientData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/events?patientId=${encodeURIComponent(patientId)}`,
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
            setPatientData({
              ...patientData,
              admissionDate: parsed.data.admissionDate,
              admissionType: parsed.data.admissionType,
              doctor: parsed.data.doctor,
              allergies: parsed.data.allergies,
              diagnosis: parsed.data.diagnosis,
              status: parsed.data.status,
            });
          }
        } catch (e) {
          console.error("Error parsing patient data from event:", e);
        }
      }
    } catch (e) {
      console.error("Error loading patient data:", e);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

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

  useEffect(() => {
    void loadPatientData();
  }, [loadPatientData]);

  // Real-time updates - poll every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      void loadPatientData();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [loadPatientData]);

  const handleUploadDocument = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf";
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setIsUploading(true);
        // Simulate upload
        setTimeout(() => {
          const newDoc = {
            id: Date.now().toString(),
            name: file.name,
            date: new Date().toLocaleDateString("es-AR"),
            location: "Hospital Central",
            doctor: "Dr. Pérez",
            status: "cargado" as const,
            pdfUrl: URL.createObjectURL(file),
          };
          setPatientData({
            ...patientData,
            documents: [...patientData.documents, newDoc],
          });
          setIsUploading(false);
        }, 1000);
      }
    };
    fileInput.click();
  };

  const handleSignDocument = (docId: string) => {
    setPatientData({
      ...patientData,
      documents: patientData.documents.map((doc) =>
        doc.id === docId
          ? { ...doc, signature: "Firma digital verificada", status: "prestado" as const }
          : doc
      ),
    });
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
          <div className="flex items-center gap-3 pb-4 border-b border-dashed border-med-line">
            <div className="w-[46px] h-[46px] rounded-[13px] bg-gradient-to-br from-med-ink to-med-secondary text-white grid place-items-center font-fraunces text-[18px] flex-shrink-0">
              {patientData.name.split(" ")[0]?.substring(0, 2).toUpperCase() || "MG"}
            </div>
            <div>
              <b className="text-[15.5px] block">{patientData.name}</b>
              <span className="text-[12.5px] text-med-muted">HC {patientData.hc} · {patientData.age} años · {patientData.gender}</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-med-secondary bg-med-secondary-soft px-2.5 py-1 rounded-[999px] whitespace-nowrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                  <path d="M20 6 9 17l-5-5"/>
                </svg>
                Verificado
              </div>
              <button
                onClick={() => void loadPatientData()}
                disabled={loading}
                className="text-[11px] font-semibold text-med-secondary hover:text-med-ink-soft disabled:opacity-50"
              >
                {loading ? "Actualizando..." : "Actualizar"}
              </button>
            </div>
          </div>

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
        </div>

        {/* Documents Section */}
        <div className="bg-white border border-med-line rounded-[20px] shadow-[0_24px_60px_-28px_rgba(14,46,41,.45)] p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-fraunces text-[21px] font-medium">Mis Documentos</h2>
            <button
              onClick={handleUploadDocument}
              disabled={isUploading}
              className="px-4 py-2 bg-med-secondary text-white text-sm font-semibold rounded-lg hover:bg-med-secondary-hover disabled:opacity-50 flex items-center gap-2"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              {isUploading ? "Subiendo..." : "Subir PDF"}
            </button>
          </div>

          {patientData.documents.length === 0 ? (
            <div className="text-center py-12 text-med-muted">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12 mx-auto mb-4 text-med-line">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <p>No tienes documentos cargados</p>
              <p className="text-sm mt-2">Sube tus documentos médicos para tenerlos siempre disponibles</p>
            </div>
          ) : (
            <div className="space-y-4">
              {patientData.documents.map((doc) => (
                <div key={doc.id} className="border border-med-line rounded-lg p-4 hover:border-med-secondary/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-med-secondary-soft flex items-center justify-center flex-shrink-0">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-med-secondary">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-[15px]">{doc.name}</h3>
                        <p className="text-sm text-med-muted mt-1">
                          {doc.date} · {doc.location} · {doc.doctor}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-[999px] ${
                            doc.status === "prestado" ? "bg-[rgba(14,140,107,.12)] text-med-secondary" :
                            doc.status === "pendiente" ? "bg-[rgba(214,154,46,.13)] text-med-amber" :
                            "bg-[rgba(92,111,106,.13)] text-med-muted"
                          }`}>
                            {doc.status}
                          </span>
                          {doc.signature && (
                            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-[999px] bg-[rgba(14,140,107,.12)] text-med-secondary flex items-center gap-1">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                                <path d="M20 6 9 17l-5-5"/>
                              </svg>
                              Firmado
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {doc.pdfUrl && (
                        <a
                          href={doc.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-med-secondary hover:underline"
                        >
                          Ver PDF
                        </a>
                      )}
                      {!doc.signature && (
                        <button
                          onClick={() => handleSignDocument(doc.id)}
                          className="text-xs text-med-secondary hover:underline"
                        >
                          Solicitar firma
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Medical Records Section */}
        <div className="bg-white border border-med-line rounded-[20px] shadow-[0_24px_60px_-28px_rgba(14,46,41,.45)] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-fraunces text-[21px] font-medium">Tu Historia Médica</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("quick")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === "quick"
                    ? "bg-med-secondary text-white"
                    : "bg-white border border-med-line text-med-muted"
                }`}
              >
                Vista rápida
              </button>
              <button
                onClick={() => setViewMode("complete")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === "complete"
                    ? "bg-med-secondary text-white"
                    : "bg-white border border-med-line text-med-muted"
                }`}
              >
                Vista completa
              </button>
            </div>
          </div>

          {viewMode === "complete" && (
            <>
              <SearchBar onSearch={setSearchQuery} />
              <FilterChips activeFilter={activeFilter} onFilterChange={setActiveFilter} />
            </>
          )}

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
                pendingDocuments: patientData.documents.filter(d => d.status === "pendiente").map(d => d.name),
                clinicalAlerts: patientData.allergies.length > 0 ? ["Alergias importantes detectadas"] : [],
              }}
            />
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
