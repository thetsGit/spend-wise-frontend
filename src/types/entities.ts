export type Spending = {
  id: number;
  email_id: number;
  merchant: string;
  amount: number | null;
  currency: string;
  category: string;
  transaction_date: string | null;
  ai_confidence: string | null;
  confidence: string;
  created_at: string;
};

export type SaaSDiscovery = {
  id: number;
  email_id: number;
  product_name: string;
  signal_type: string;
  billing_cycle: string;
  estimated_cost: number | null;
  currency: string;
  ai_confidence: string | null;
  confidence: string;
  created_at: string;
};

export type CategorySummary = {
  category: string;
  total_spend: number;
  total_count: number;
};

export type SpendingSummary = {
  total_spend: number;
  total_count: number;
  by_category: CategorySummary[];
};

export type SaaSDiscoverySummary = {
  total_monthly_spend: number;
  total_tools_found: number;
};

export type UploadSummary = {
  total_emails: number;
  inserted: number;
  skipped: number;
  invalid: number;
  spending_found: number;
  saas_found: number;
};
