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
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(window.location.search);
        
        // Handle password recovery flow
        if (queryParams.get("type") === "recovery" || hashParams.get("type") === "recovery") {
          // For PKCE flow with code parameter
          if (queryParams.has("code")) {
            try {
              const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
              
              if (error) {
                // If PKCE fails (e.g., link opened on different device), show helpful error
                if (error.message.includes("code verifier")) {
                  setError("This reset link must be opened on the same device where you requested the password reset. Please request a new reset link.");
                } else {
                  setError(error.message);
                }
                return;
              }
              
              navigate("/auth?reset=true");
            } catch (err) {
              setError("Unable to process reset link. Please request a new one.");
              return;
            }
          } 
          // For hash-based recovery tokens (older flow)
          else if (hashParams.has("access_token")) {
            // Supabase client will automatically handle this
            // Just verify we have a session and redirect
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error || !session) {
              setError("Invalid or expired reset link. Please request a new one.");
              return;
            }
            
            navigate("/auth?reset=true");
          } else {
            setError("Invalid reset link format. Please request a new reset link.");
            return;
          }
        } 
        // Handle other auth callbacks (OAuth, magic links, etc.)
        else if (queryParams.has("code")) {
          const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
          
          if (error) {
            setError(error.message);
            return;
          }
          
          navigate("/dashboard");
        } else {
          navigate("/auth");
        }
      } catch (err) {
        console.error("[AuthCallback] Exception during auth callback:", err);
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
            <CardTitle>Password Reset Link Issue</CardTitle>
            <CardDescription>We couldn't process your password reset link</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{error}</p>
            <div className="bg-muted p-3 rounded-md text-sm">
              <p className="font-medium mb-1">💡 Tip:</p>
              <p className="text-muted-foreground">
                Password reset links must be opened on the same device and browser where you requested the reset. 
                If you've switched devices or cleared your browser data, please request a new link below.
              </p>
            </div>
            <button
              onClick={() => navigate("/auth?forgot=true")}
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
