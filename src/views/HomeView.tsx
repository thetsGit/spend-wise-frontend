import { useEffect } from "react";
import { CreditCard, Search, TrendingUp, Layers } from "lucide-react";

import { type View } from "@/constants/views";

import { useRequest } from "@/hooks/useRequest";

import { getSpendingSummary } from "@/api/spending-services";
import { getSaaSDiscoverySummary } from "@/api/saas-services";

import { UploadSection } from "@/components/blocks";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type Props = {
  onSelect: (view: View) => void;
};

export function HomeView({ onSelect }: Props) {
  const spending = useRequest(getSpendingSummary);
  const saas = useRequest(getSaaSDiscoverySummary);

  useEffect(() => {
    spending.execute(undefined);
    saas.execute(undefined);
  }, []);

  const refreshData = () => {
    spending.execute(undefined);
    saas.execute(undefined);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-stone-900">
          Dashboard
        </h2>
        <p className="text-sm text-muted-foreground">
          Upload emails to analyze spending and discover SaaS subscriptions
        </p>
      </div>

      <UploadSection onSuccess={refreshData} />

      <Separator />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card
          className="cursor-pointer transition-all hover:shadow-md hover:border-emerald-200"
          onClick={() => onSelect("spending")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Spending
            </CardTitle>
            <CreditCard size={18} className="text-emerald-600" />
          </CardHeader>
          <CardContent>
            {spending.pending ? (
              <div className="h-8 w-24 animate-pulse rounded bg-muted" />
            ) : (
              <>
                <p className="text-2xl font-bold text-stone-900">
                  {spending.data
                    ? `$${spending.data.total_spend.toFixed(2)}`
                    : "—"}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-emerald-50 text-emerald-700"
                  >
                    <TrendingUp size={12} className="mr-1" />
                    {spending.data?.total_count || 0} transactions
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-emerald-50 text-emerald-700"
                  >
                    <Layers size={12} className="mr-1" />
                    {spending.data?.by_category?.length || 0} categories
                  </Badge>
                </div>
              </>
            )}
            <Button variant="link" className="mt-3 h-auto p-0 text-emerald-700">
              View details →
            </Button>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer transition-all hover:shadow-md hover:border-emerald-200"
          onClick={() => onSelect("saas")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              SaaS Discovery
            </CardTitle>
            <Search size={18} className="text-emerald-600" />
          </CardHeader>
          <CardContent>
            {saas.pending ? (
              <div className="h-8 w-24 animate-pulse rounded bg-muted" />
            ) : (
              <>
                <p className="text-2xl font-bold text-stone-900">
                  {saas.data
                    ? `$${saas.data.total_monthly_spend.toFixed(2)}/mo`
                    : "—"}
                </p>
                <Badge
                  variant="secondary"
                  className="mt-2 bg-emerald-50 text-emerald-700"
                >
                  <Layers size={12} className="mr-1" />
                  {saas.data?.total_tools_found || 0} tools detected
                </Badge>
              </>
            )}
            <Button variant="link" className="mt-3 h-auto p-0 text-emerald-700">
              View details →
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
