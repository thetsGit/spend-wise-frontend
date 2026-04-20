import { useEffect, useState } from "react";

import { DollarSign, TrendingUp, Layers, X } from "lucide-react";

import { cn } from "@/lib/utils";

import { useRequest } from "@/hooks/useRequest";

import { getSpending, getSpendingSummary } from "@/api/app-services";

import {
  CATEGORIES,
  CATEGORY_STYLES,
  CONFIDENCE_STYLES,
} from "@/constants/presets";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { SectionHeader } from "@/components/listings";

const formatCurrency = (amount: number | null, currency: string) =>
  amount !== null ? `${currency} ${amount.toFixed(2)}` : "—";

const formatDate = (date: string | null) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

export function SpendingView() {
  const [category, setCategory] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const list = useRequest(getSpending);
  const summary = useRequest(getSpendingSummary);

  const fetchData = () => {
    const params: Record<string, string> = {};
    if (category && category !== "all") params.category = category;
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    list.execute(Object.keys(params).length > 0 ? params : undefined);
    summary.execute(undefined);
  };

  // Refetch list on any filter value change
  useEffect(() => {
    fetchData();
  }, [category, startDate, endDate]);

  const clearFilters = () => {
    setCategory("all");
    setStartDate("");
    setEndDate("");
  };

  const hasFilters = category !== "all" || startDate || endDate;
  const topCategory = summary.data?.by_category.sort(
    // Rank category by total_count in desc order
    (c1, c2) => c2.total_count - c1.total_count,
  )[0];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-stone-900">
          Spending
        </h2>
        <p className="text-sm text-muted-foreground">
          Categorized transactions from your emails
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Spend
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
                    ? `$${summary.data.total_spend.toFixed(2)}`
                    : "—"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {summary.data?.total_count || 0} transactions
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Top Category
            </CardTitle>
            <TrendingUp size={18} className="text-emerald-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold capitalize">
              {topCategory?.category?.replace("_", " ") || "—"}
            </p>
            <p className="text-xs text-muted-foreground">
              {topCategory
                ? `$${topCategory.total_spend.toFixed(2)} · ${topCategory.total_count} txns`
                : ""}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Categories
            </CardTitle>
            <Layers size={18} className="text-emerald-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {summary.data?.by_category?.length || 0}
            </p>
            <p className="text-xs text-muted-foreground">unique categories</p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Error */}
      {Boolean(list.error) && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center justify-between pt-6">
            {list.error instanceof Object && "message" in list.error && (
              <p className="text-sm text-red-700">
                {String(list.error.message)}
              </p>
            )}

            <Button variant="outline" size="sm" onClick={fetchData}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {Boolean(list.data) && (
        <>
          {/* SaaS Tools List */}
          <SectionHeader
            title="Spendings"
            description={`${list.data?.length || 0} transactions detected from email signals`}
          />

          {/* Table with inline filters */}
          <Card>
            <CardContent className="p-0">
              {/* Filters inside table card */}
              <div className="flex flex-wrap items-end justify-end gap-3 p-4">
                <div className="w-44">
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-36">
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="Start date"
                  />
                </div>
                <div className="w-36">
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="End date"
                  />
                </div>
                {hasFilters && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearFilters}
                    className="text-muted-foreground"
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>

              <Separator />

              {/* Table content */}
              {list.pending ? (
                <div className="space-y-3 p-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-12 animate-pulse rounded bg-muted"
                    />
                  ))}
                </div>
              ) : !list.data?.length ? (
                <div className="py-16 text-center text-sm text-muted-foreground">
                  No transactions found.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Merchant</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Confidence</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {list.data.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.merchant}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(item.amount, item.currency)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              "font-normal",
                              CATEGORY_STYLES[item.category],
                            )}
                          >
                            {item.category.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(item.transaction_date)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "font-normal",
                              CONFIDENCE_STYLES[item.confidence],
                            )}
                          >
                            {item.confidence}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
