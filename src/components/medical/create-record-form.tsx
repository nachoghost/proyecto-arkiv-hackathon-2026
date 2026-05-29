"use client";

import { useState } from "react";

const RECORD_TYPES = [
  { id: "consultation", label: "Consulta médica" },
  { id: "hospitalization", label: "Internación" },
  { id: "surgery", label: "Cirugía" },
  { id: "allergy", label: "Alergia o reacción" },
  { id: "medication", label: "Medicación" },
  { id: "study", label: "Estudio o análisis" },
  { id: "diagnosis", label: "Diagnóstico" },
  { id: "vaccine", label: "Vacuna" },
  { id: "document", label: "Documento médico" },
  { id: "other", label: "Otro" },
];

export function CreateRecordForm({ onSubmit, onCancel }: {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const [recordType, setRecordType] = useState("");
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleTypeChange = (type: string) => {
    setRecordType(type);
    setFormData({});
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ recordType, ...formData });
  };

  const renderFields = () => {
    switch (recordType) {
      case "surgery":
        return (
          <>
            <div>
              <label className="block text-xs text-med-muted mb-1">Fecha</label>
              <input
                type="date"
                value={formData.date || ""}
                onChange={(e) => handleFieldChange("date", e.target.value)}
                className="w-full px-3 py-2 border border-med-line rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-med-muted mb-1">Institución</label>
              <input
                type="text"
                value={formData.institution || ""}
                onChange={(e) => handleFieldChange("institution", e.target.value)}
                className="w-full px-3 py-2 border border-med-line rounded-lg text-sm"
                placeholder="Hospital X"
              />
            </div>
            <div>
              <label className="block text-xs text-med-muted mb-1">Procedimiento</label>
              <input
                type="text"
                value={formData.procedure || ""}
                onChange={(e) => handleFieldChange("procedure", e.target.value)}
                className="w-full px-3 py-2 border border-med-line rounded-lg text-sm"
                placeholder="Apendicectomía"
              />
            </div>
            <div>
              <label className="block text-xs text-med-muted mb-1">Motivo</label>
              <textarea
                value={formData.reason || ""}
                onChange={(e) => handleFieldChange("reason", e.target.value)}
                className="w-full px-3 py-2 border border-med-line rounded-lg text-sm"
                rows={2}
                placeholder="Apendicitis aguda"
              />
            </div>
            <div>
              <label className="block text-xs text-med-muted mb-1">Médico responsable</label>
              <input
                type="text"
                value={formData.doctor || ""}
                onChange={(e) => handleFieldChange("doctor", e.target.value)}
                className="w-full px-3 py-2 border border-med-line rounded-lg text-sm"
                placeholder="Dr. Pérez"
              />
            </div>
          </>
        );
      case "allergy":
        return (
          <>
            <div>
              <label className="block text-xs text-med-muted mb-1">Sustancia</label>
              <input
                type="text"
                value={formData.substance || ""}
                onChange={(e) => handleFieldChange("substance", e.target.value)}
                className="w-full px-3 py-2 border border-med-line rounded-lg text-sm"
                placeholder="Penicilina"
              />
            </div>
            <div>
              <label className="block text-xs text-med-muted mb-1">Tipo de reacción</label>
              <select
                value={formData.reactionType || ""}
                onChange={(e) => handleFieldChange("reactionType", e.target.value)}
                className="w-full px-3 py-2 border border-med-line rounded-lg text-sm"
              >
                <option value="">Seleccionar...</option>
                <option value="mild">Leve</option>
                <option value="moderate">Moderada</option>
                <option value="severe">Grave</option>
                <option value="anaphylaxis">Anafilaxis</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-med-muted mb-1">Fecha aproximada</label>
              <input
                type="date"
                value={formData.date || ""}
                onChange={(e) => handleFieldChange("date", e.target.value)}
                className="w-full px-3 py-2 border border-med-line rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-med-muted mb-1">Confirmada por médico</label>
              <select
                value={formData.confirmedByDoctor || ""}
                onChange={(e) => handleFieldChange("confirmedByDoctor", e.target.value)}
                className="w-full px-3 py-2 border border-med-line rounded-lg text-sm"
              >
                <option value="">Seleccionar...</option>
                <option value="yes">Sí</option>
                <option value="no">No</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-med-muted mb-1">Observaciones</label>
              <textarea
                value={formData.observations || ""}
                onChange={(e) => handleFieldChange("observations", e.target.value)}
                className="w-full px-3 py-2 border border-med-line rounded-lg text-sm"
                rows={2}
                placeholder="Detalles adicionales"
              />
            </div>
          </>
        );
      default:
        return (
          <>
            <div>
              <label className="block text-xs text-med-muted mb-1">Fecha</label>
              <input
                type="date"
                value={formData.date || ""}
                onChange={(e) => handleFieldChange("date", e.target.value)}
                className="w-full px-3 py-2 border border-med-line rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-med-muted mb-1">Descripción</label>
              <textarea
                value={formData.description || ""}
                onChange={(e) => handleFieldChange("description", e.target.value)}
                className="w-full px-3 py-2 border border-med-line rounded-lg text-sm"
                rows={3}
                placeholder="Detalles del registro..."
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="bg-white border border-med-line rounded-[20px] shadow-[0_24px_60px_-28px_rgba(14,46,41,.45)] p-6">
      <h2 className="font-fraunces text-[21px] font-medium mb-6">Nuevo Registro Médico</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-med-muted mb-2">Tipo de registro</label>
          <div className="grid grid-cols-2 gap-2">
            {RECORD_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => handleTypeChange(type.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  recordType === type.id
                    ? "bg-med-secondary text-white"
                    : "bg-white border border-med-line text-med-muted hover:border-med-secondary"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {recordType && (
          <div className="space-y-4 pt-4 border-t border-med-line">
            {renderFields()}
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={!recordType}
            className="flex-1 px-4 py-2 bg-med-secondary text-white text-sm font-semibold rounded-lg hover:bg-med-secondary-hover disabled:opacity-50"
          >
            Guardar registro
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-med-line text-sm font-semibold rounded-lg hover:bg-med-surface-elevated"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
