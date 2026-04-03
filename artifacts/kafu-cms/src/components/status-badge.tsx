import { STATUS_LABELS, STATUS_COLORS, type WorkflowStatus } from "@/lib/api";

export function StatusBadge({ status }: { status: string }) {
  const colorClass = STATUS_COLORS[status as WorkflowStatus] ?? "bg-gray-100 text-gray-600";
  const label = STATUS_LABELS[status as WorkflowStatus] ?? status;
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${colorClass}`}>
      {label}
    </span>
  );
}
