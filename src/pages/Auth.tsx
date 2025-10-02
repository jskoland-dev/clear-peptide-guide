import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Syringe } from "lucide-react";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Detect reset mode by query param
    if (searchParams.get("reset") === "true") {
      setIsResettingPassword(true);
      setIsLogin(false);
      setIsForgotPassword(false);
    }

    // Attempt to exchange code/token for a session (handles email links across browsers)
    const tryExchange = async () => {
      try {
        const href = window.location.href;
        if (href.includes("code=") || href.includes("token_hash=") || href.includes("type=recovery")) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(href);
          if (error) {
            console.warn("exchangeCodeForSession error:", error.message);
          } else {
            // If this was a recovery link, show reset form
            setIsResettingPassword(true);
            setIsLogin(false);
            setIsForgotPassword(false);
            // Clean the URL to avoid re-exchanging on refresh
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }
      } catch (err) {
        console.warn("exchange session failed", err);
      }
    };
    tryExchange();

    // Listen for PASSWORD_RECOVERY event as a fallback
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsResettingPassword(true);
        setIsLogin(false);
        setIsForgotPassword(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isResettingPassword) {
        if (newPassword !== confirmPassword) {
          toast({
            title: "Passwords don't match",
            description: "Please make sure both passwords are the same.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        if (newPassword.length < 6) {
          toast({
            title: "Password too short",
            description: "Password must be at least 6 characters.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });
        if (error) throw error;
        toast({ 
          title: "Password updated!", 
          description: "Your password has been successfully reset." 
        });
        navigate("/dashboard");
      } else if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth?reset=true`,
        });
        if (error) throw error;
        toast({ 
          title: "Check your email", 
          description: "We've sent you a password reset link." 
        });
        setIsForgotPassword(false);
      } else if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast({ title: "Welcome back!", description: "Successfully signed in." });
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });
        if (error) throw error;
        toast({ 
          title: "Account created!", 
          description: "You can now sign in and start tracking." 
        });
        setIsLogin(true);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Syringe className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">
            {isResettingPassword 
              ? "Set New Password" 
              : isForgotPassword 
                ? "Reset Password" 
                : isLogin 
                  ? "Welcome Back" 
                  : "Create Account"
            }
          </CardTitle>
          <CardDescription>
            {isResettingPassword
              ? "Enter your new password below"
              : isForgotPassword 
                ? "Enter your email to receive a password reset link" 
                : isLogin 
                  ? "Sign in to access your dose tracking" 
                  : "Start tracking your peptide journey"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isResettingPassword ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>
              </>
            ) : (
              <>
                {!isLogin && !isForgotPassword && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required={!isLogin}
                      placeholder="John Doe"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                  />
                </div>
                {!isForgotPassword && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      {isLogin && (
                        <button
                          type="button"
                          onClick={() => setIsForgotPassword(true)}
                          className="text-xs text-primary hover:underline"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      minLength={6}
                    />
                  </div>
                )}
              </>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading 
                ? "Loading..." 
                : isResettingPassword 
                  ? "Reset Password" 
                  : isForgotPassword 
                    ? "Send Reset Link" 
                    : isLogin 
                      ? "Sign In" 
                      : "Sign Up"
              }
            </Button>
          </form>
          <div className="mt-4 text-center text-sm space-y-2">
            {isForgotPassword ? (
              <button
                type="button"
                onClick={() => setIsForgotPassword(false)}
                className="text-primary hover:underline"
              >
                Back to sign in
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline"
              >
                {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
