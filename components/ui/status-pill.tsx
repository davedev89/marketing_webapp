import { cn } from "@/lib/utils/cn";

type StatusPillProps = {
  label: string;
  tone?: "success" | "warning" | "danger" | "neutral";
};

const styles = {
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-rose-100 text-rose-700",
  neutral: "bg-slate-100 text-slate-700"
};

export function StatusPill({ label, tone = "neutral" }: StatusPillProps) {
  return <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-semibold", styles[tone])}>{label}</span>;
}
