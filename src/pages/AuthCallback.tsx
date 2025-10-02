import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const href = window.location.href;
        console.log("[AuthCallback] Processing callback URL");
        
        if (href.includes("code=") || href.includes("token_hash=") || href.includes("type=recovery")) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(href);
          
          if (error) {
            console.error("[AuthCallback] Exchange failed:", error.message);
            setError(error.message);
            return;
          }
          
          console.log("[AuthCallback] Exchange successful, redirecting to reset form");
          navigate("/auth?reset=true");
        } else {
          console.warn("[AuthCallback] No recovery parameters found");
          navigate("/auth");
        }
      } catch (err) {
        console.error("[AuthCallback] Exception during exchange:", err);
        setError("An unexpected error occurred. Please try again.");
      }
    };

    handleCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Reset Link Error</CardTitle>
            <CardDescription>There was a problem with your password reset link</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{error}</p>
            <button
              onClick={() => navigate("/auth?reset=true")}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Request New Reset Link
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Processing Reset Link...</CardTitle>
          <CardDescription>Please wait while we verify your request</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
