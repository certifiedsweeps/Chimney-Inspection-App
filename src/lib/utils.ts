import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function generateInspectionNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 900) + 100;
  return `CI-${year}${month}${day}-${rand}`;
}

export function inspectionLevelLabel(level: string): string {
  const labels: Record<string, string> = {
    level1: "Level I",
    level2: "Level II",
    level3: "Level III",
  };
  return labels[level] ?? level;
}

export function chimneyTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    masonry: "Masonry Chimney",
    factory_built: "Factory-Built Fireplace / Chimney",
  };
  return labels[type] ?? type;
}

export function overallConditionLabel(condition: string | null | undefined): string {
  if (!condition) return "—";
  const labels: Record<string, string> = {
    satisfactory: "Satisfactory",
    unsatisfactory: "Unsatisfactory",
    further_evaluation: "Further Evaluation Required",
  };
  return labels[condition] ?? condition;
}

export function statusBadgeClass(condition: string | null | undefined): string {
  if (!condition) return "bg-gray-100 text-gray-600";
  const classes: Record<string, string> = {
    satisfactory: "bg-green-100 text-green-800",
    unsatisfactory: "bg-red-100 text-red-800",
    further_evaluation: "bg-yellow-100 text-yellow-800",
  };
  return classes[condition] ?? "bg-gray-100 text-gray-600";
}
