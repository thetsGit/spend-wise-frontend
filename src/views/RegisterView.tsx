import { Mail, Shield, Sparkles } from "lucide-react";

import { redirect } from "@/states/oauth";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { Feature } from "@/components/listings";
import { GoogleIcon } from "@/components/elements";

export function RegisterView() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center text-center py-10 px-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
            <Sparkles className="h-7 w-7 text-emerald-600" />
          </div>

          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-stone-900">
            Welcome
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            Sign in to analyze your spending and discover SaaS subscriptions
            from your inbox.
          </p>

          <Button
            onClick={redirect}
            size="lg"
            variant="outline"
            className="mt-6 w-full gap-2 border-stone-200 hover:border-emerald-200 hover:bg-emerald-50"
          >
            <GoogleIcon className="h-5 w-5" />
            Continue with Google
          </Button>

          <Separator className="my-6" />

          <div className="w-full space-y-3 text-left">
            <Feature
              icon={<Mail className="h-4 w-4 text-emerald-600" />}
              title="Read-only access"
              description="We only read emails you upload — nothing is sent on your behalf."
            />
            <Feature
              icon={<Shield className="h-4 w-4 text-emerald-600" />}
              title="Your data stays yours"
              description="Revoke access anytime from your Google account settings."
            />
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            By continuing you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
