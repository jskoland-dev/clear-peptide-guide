import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export function useSubscription() {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Ensure we don't render a free view before subscription status is known
      setLoading(true);
      checkSubscription();
    } else {
      setIsPremium(false);
      setLoading(false);
    }
  }, [user]);

  const checkSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from("user_subscriptions")
        .select("status, current_period_end")
        .eq("user_id", user?.id)
        .single();

      if (error) {
        console.error("Subscription fetch error:", error);
        setIsPremium(false);
        setLoading(false);
        return;
      }

      if (data) {
        const isActive = data.status === "premium" && 
          (!data.current_period_end || new Date(data.current_period_end) > new Date());
        console.log("Subscription check:", { status: data.status, isPremium: isActive });
        setIsPremium(isActive);
      } else {
        setIsPremium(false);
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
      setIsPremium(false);
    } finally {
      setLoading(false);
    }
  };

  return { isPremium, loading, refetch: checkSubscription };
}
