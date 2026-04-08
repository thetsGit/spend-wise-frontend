import { useEffect } from "react";

import { DollarSign, Package, Layers } from "lucide-react";

import { cn } from "@/lib/utils";

import { useRequest } from "@/hooks/useRequest";
import {
  getSaaSDiscoveries,
  getSaaSDiscoverySummary,
} from "@/api/saas-services";

import {
  SIGNAL_STYLES,
  CONFIDENCE_STYLES,
  SIGNAL_TYPES_LABELS,
  BILLING_CYCLES_LABELS,
} from "@/constants/presets";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const formatCost = (cycle: string, cost?: number | null) => {
  if (cost !== 0 && !cost) return "No pricing data";
  const parsed = `$${cost.toFixed(2)}`;
  if (cycle === "monthly") return `${parsed}/mo`;
  if (cycle === "annual") return `${parsed}/yr`;
  return parsed;
};

export function SaaSView() {
  const list = useRequest(getSaaSDiscoveries);
  const summary = useRequest(getSaaSDiscoverySummary);

  useEffect(() => {
    list.execute(undefined);
    summary.execute(undefined);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-stone-900">
          SaaS Discovery
        </h2>
        <p className="text-sm text-muted-foreground">
          Software subscriptions detected from your emails
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly SaaS Spend
            </CardTitle>
            <DollarSign size={18} className="text-emerald-600" />
          </CardHeader>
          <CardContent>
            {summary.pending ? (
              <div className="h-8 w-24 animate-pulse rounded bg-muted" />
            ) : (
              <>
                <p className="text-2xl font-bold">
                  {summary.data
                    ? `$${summary.data.total_monthly_spend.toFixed(2)}`
                    : "—"}
                </p>
                <p className="text-xs text-muted-foreground">
                  estimated monthly cost
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Tools Detected
            </CardTitle>
            <Package size={18} className="text-emerald-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {summary.data?.total_tools_found || 0}
            </p>
            <p className="text-xs text-muted-foreground">unique products</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Signals
            </CardTitle>
            <Layers size={18} className="text-emerald-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{list.data?.length || 0}</p>
            <p className="text-xs text-muted-foreground">
              email signals processed
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Error */}
      {Boolean(list.error) && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center justify-between pt-6">
            <p className="text-sm text-red-700">{String(list.error)}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => list.execute(undefined)}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* SaaS Tools List */}
      <div>
        <h3 className="text-lg font-semibold text-stone-900">Detected Tools</h3>
        <p className="text-sm text-muted-foreground">
          {list.data?.length || 0} subscriptions identified from email signals
        </p>
      </div>

      {list.pending ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : !list.data?.length ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            No SaaS tools detected.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {list.data.map((item) => (
            <Card
              key={item.id}
              className="transition-all hover:shadow-md hover:border-emerald-200"
            >
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                    <Package size={18} className="text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900">
                      {item.product_name}
                    </h4>
                    <div className="mt-1 flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-normal",
                          SIGNAL_STYLES[item.signal_type],
                        )}
                      >
                        {SIGNAL_TYPES_LABELS[item.signal_type] ||
                          item.signal_type}
                      </Badge>
                      <Badge variant="outline" className="font-normal">
                        {BILLING_CYCLES_LABELS[item.billing_cycle] ||
                          item.billing_cycle}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-700">
                      {formatCost(item.billing_cycle, item.estimated_cost)}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "font-normal",
                      CONFIDENCE_STYLES[item.confidence],
                    )}
                  >
                    {item.confidence}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
