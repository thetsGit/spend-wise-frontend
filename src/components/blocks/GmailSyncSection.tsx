import { type FC } from "react";
import { toast } from "sonner";
import { Loader2, Mail, RefreshCw, CheckCircle2 } from "lucide-react";

import { useRequest } from "@/hooks";

import { syncGmails } from "@/api/app-services";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {
  onSuccess: VoidFunction;
};

export const GmailSyncSection: FC<Props> = ({ onSuccess }) => {
  const sync = useRequest(syncGmails, {
    onSuccess: (data) => {
      if (data) {
        toast.success("Gmail sync complete", {
          description: `${data.inserted} emails processed, ${data.skipped} skipped, ${data.invalid} invalid, ${data.spending_found} transactions, ${data.saas_found} SaaS tools found`,
        });
        onSuccess();
      }
    },
    onError: (err) => {
      toast.error("Gmail sync failed", {
        description: (err as Error).message,
      });
    },
  });

  return (
    <Card className="border-stone-200 bg-white">
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
            <Mail size={22} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-stone-700">
              Sync directly from Gmail
            </p>
            <p className="mt-1 text-xs text-stone-500">
              We'll scan your recent emails automatically
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => sync.execute({})}
            disabled={sync.fetching}
          >
            {sync.fetching ? (
              <>
                <Loader2 size={14} className="mr-1 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw size={14} className="mr-1" />
                Sync now
              </>
            )}
          </Button>
        </div>

        {sync.fetching && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 size={16} className="animate-spin" />
            Fetching and analyzing emails...
          </div>
        )}

        {sync.data && (
          <div className="mt-4 rounded-md bg-emerald-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-700" />
              <p className="text-sm font-medium text-emerald-800">
                Sync complete
              </p>
            </div>
            <div className="mt-2 flex flex-wrap gap-4 text-xs text-emerald-700">
              <span>{sync.data.total_emails} emails</span>
              <span>{sync.data.inserted} inserted</span>
              <span>{sync.data.invalid} invalid</span>
              <span>{sync.data.skipped} skipped</span>
              <span>{sync.data.spending_found} transactions</span>
              <span>{sync.data.saas_found} SaaS tools</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
