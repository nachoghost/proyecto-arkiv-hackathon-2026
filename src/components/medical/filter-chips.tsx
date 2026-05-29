"use client";

const FILTERS = [
  { id: "all", label: "Todos" },
  { id: "consultations", label: "Consultas" },
  { id: "hospitalizations", label: "Internaciones" },
  { id: "surgeries", label: "Cirugías" },
  { id: "studies", label: "Estudios" },
  { id: "medications", label: "Medicamentos" },
  { id: "allergies", label: "Alergias" },
  { id: "documents", label: "Documentos" },
  { id: "pending", label: "Pendientes" },
  { id: "verified", label: "Verificados" },
];

export function FilterChips({ activeFilter, onFilterChange }: { activeFilter: string; onFilterChange: (filter: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            activeFilter === filter.id
              ? "bg-med-secondary text-white"
              : "bg-white border border-med-line text-med-muted hover:border-med-secondary"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
