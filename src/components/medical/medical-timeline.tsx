import { MedicalRecordCard } from "./medical-record-card";

export function MedicalTimeline({ records, onPin, onViewDetails }: {
  records: Array<{
    id: string;
    title: string;
    type: string;
    date: string;
    institution?: string;
    doctor?: string;
    status: "declared" | "document_attached" | "ai_extracted" | "pending_review" | "verified" | "institution_issued" | "corrected" | "discarded";
    hasDocument?: boolean;
    importance?: "critical" | "important" | "routine";
    isPinned?: boolean;
  }>;
  onPin?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}) {
  // Group records by year - parse date from Spanish format (dd/mm/yyyy)
  const groupedByYear = records.reduce((acc, record) => {
    let year: number;
    try {
      // Parse Spanish date format (dd/mm/yyyy)
      const parts = record.date.split("/");
      if (parts.length === 3) {
        year = parseInt(parts[2], 10);
      } else {
        // Try standard date parsing
        year = new Date(record.date).getFullYear();
      }
    } catch {
      year = new Date().getFullYear();
    }

    if (isNaN(year)) {
      year = new Date().getFullYear();
    }

    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(record);
    return acc;
  }, {} as Record<number, typeof records>);

  const sortedYears = Object.keys(groupedByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="space-y-8">
      {sortedYears.map((year) => (
        <div key={year}>
          <h3 className="font-fraunces text-[19px] font-medium mb-4 text-med-ink">{year}</h3>
          <div className="space-y-3">
            {groupedByYear[year]
              .sort((a, b) => {
                // Parse dates for sorting
                const parseDate = (dateStr: string) => {
                  const parts = dateStr.split("/");
                  if (parts.length === 3) {
                    return new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10)).getTime();
                  }
                  return new Date(dateStr).getTime();
                };
                return parseDate(b.date) - parseDate(a.date);
              })
              .map((record) => (
                <MedicalRecordCard
                  key={record.id}
                  record={record}
                  onPin={onPin}
                  onViewDetails={onViewDetails}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
