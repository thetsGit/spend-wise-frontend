import { useRef, useState, type FC } from "react";
import { toast } from "sonner";
import { Upload, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

import { parseCSV } from "@/helpers/csv";

import { useRequest } from "@/hooks";

import { uploadEmails } from "@/api/app-services";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {
  onSuccess: VoidFunction;
};

export const UploadSection: FC<Props> = ({ onSuccess }) => {
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onUploadProcessed = () => {
    if (fileInputRef?.current) {
      fileInputRef.current.value = "";
    }
  };

  const upload = useRequest(uploadEmails, {
    onSuccess: (data) => {
      if (data) {
        toast.success("Upload complete", {
          description: `${data.inserted} emails processed, ${data.skipped} skipped, ${data.invalid} invalid, ${data.spending_found} transactions, ${data.saas_found} SaaS tools found`,
        });
        onSuccess();
      }

      onUploadProcessed();
    },
    onError: (err) => {
      toast.error("Upload failed", {
        description: (err as Error).message,
      });

      onUploadProcessed();
    },
  });

  const handleFile = async (file: File) => {
    if (file.name.endsWith(".json")) {
      // Serialize json and call API
      const content = await file.text();
      upload.execute(content);
    } else if (file.name.endsWith(".csv")) {
      // Parse CSV file into JSON and call API
      const reader = new FileReader();
      reader.onload = function (e) {
        const content = e.target?.result;
        if (typeof content === "string") {
          try {
            const result = parseCSV(content);
            upload.execute(JSON.stringify(result?.records));
          } catch (e) {
            toast.error("Invalid csv file", {
              description: (e as Error).message,
            });
          }
        }
      };
      reader.readAsText(file);
    } else {
      toast.error("Invalid file type", {
        description: "Please upload a JSON/CSV file",
      });
      return;
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleClick = () => fileInputRef.current?.click();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <Card
      className={cn(
        "border-2 border-dashed transition-colors",
        dragging
          ? "border-emerald-400 bg-emerald-50"
          : "border-stone-300 bg-white hover:border-stone-400",
      )}
    >
      <CardContent className="p-6">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className="flex flex-col items-center gap-3 py-4 text-center"
        >
          <Upload size={28} className="text-emerald-600" />
          <div>
            <p className="text-sm font-medium text-stone-700">
              Drop your email JSON/CSV file here
            </p>
            <p className="mt-1 text-xs text-stone-500">or click to browse</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClick}
            disabled={upload.fetching}
          >
            {upload.fetching ? (
              <>
                <Loader2 size={14} className="mr-1 animate-spin" />
                Processing...
              </>
            ) : (
              "Select File"
            )}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.csv"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>

        {upload.fetching && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 size={16} className="animate-spin" />
            Analyzing emails with AI...
          </div>
        )}

        {upload.data && (
          <div className="mt-4 rounded-md bg-emerald-50 px-4 py-3">
            <p className="text-sm font-medium text-emerald-800">
              Upload complete
            </p>
            <div className="mt-2 flex flex-wrap gap-4 text-xs text-emerald-700">
              <span>{upload.data.total_emails} emails</span>
              <span>{upload.data.inserted} inserted</span>
              <span>{upload.data.invalid} invalid</span>
              <span>{upload.data.skipped} skipped</span>
              <span>{upload.data.spending_found} transactions</span>
              <span>{upload.data.saas_found} SaaS tools</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
