export const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "food_delivery", label: "Food Delivery" },
  { value: "travel", label: "Travel" },
  { value: "software", label: "Software" },
  { value: "shopping", label: "Shopping" },
  { value: "utilities", label: "Utilities" },
  { value: "entertainment", label: "Entertainment" },
  { value: "other", label: "Other" },
] as const;

export const CATEGORIES_LABELS = Object.fromEntries(
  CATEGORIES.map(({ value, label }) => [value, label]),
);

export const SIGNAL_TYPES = [
  { value: "welcome", label: "Welcome" },
  { value: "invoice", label: "Invoice" },
  { value: "renewal", label: "Renewal" },
  { value: "trial_expiring", label: "Trial Expiring" },
  { value: "usage_report", label: "Usage Report" },
  { value: "other", label: "Other" },
] as const;

export const SIGNAL_TYPES_LABELS = Object.fromEntries(
  SIGNAL_TYPES.map(({ value, label }) => [value, label]),
);

export const BILLING_CYCLES = [
  { value: "monthly", label: "Monthly" },
  { value: "annual", label: "Annual" },
  { value: "unknown", label: "Unknown" },
] as const;

export const BILLING_CYCLES_LABELS = Object.fromEntries(
  BILLING_CYCLES.map(({ value, label }) => [value, label]),
);

export const CONFIDENCE_LEVELS = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
] as const;

export const CONFIDENCE_LEVELS_LABELS = Object.fromEntries(
  CONFIDENCE_LEVELS.map(({ value, label }) => [value, label]),
);

export const CATEGORY_STYLES: Record<string, string> = {
  food_delivery: "bg-orange-50 text-orange-700 border-orange-200",
  travel: "bg-blue-50 text-blue-700 border-blue-200",
  software: "bg-purple-50 text-purple-700 border-purple-200",
  shopping: "bg-pink-50 text-pink-700 border-pink-200",
  utilities: "bg-slate-50 text-slate-700 border-slate-200",
  entertainment: "bg-indigo-50 text-indigo-700 border-indigo-200",
  other: "bg-stone-50 text-stone-700 border-stone-200",
};

export const SIGNAL_STYLES: Record<string, string> = {
  welcome: "bg-blue-50 text-blue-700 border-blue-200",
  invoice: "bg-emerald-50 text-emerald-700 border-emerald-200",
  renewal: "bg-purple-50 text-purple-700 border-purple-200",
  trial_expiring: "bg-amber-50 text-amber-700 border-amber-200",
  usage_report: "bg-slate-50 text-slate-700 border-slate-200",
  other: "bg-stone-50 text-stone-700 border-stone-200",
};

export const CONFIDENCE_STYLES: Record<string, string> = {
  high: "bg-emerald-50 text-emerald-700",
  medium: "bg-amber-50 text-amber-700",
  low: "bg-red-50 text-red-700",
};
