import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

type AIUsage = {
  used: number;
  remaining: number;
  limit: number;
  resetDate: string;
};

export function useAIUsage() {
  const { user } = useAuth();
  const [usage, setUsage] = useState<AIUsage | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUsage = async () => {
    if (!user) {
      setUsage(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .rpc('get_ai_usage', { p_user_id: user.id })
        .single();

      if (error) throw error;

      if (data) {
        setUsage({
          used: data.used,
          remaining: data.remaining,
          limit: data.limit_value,
          resetDate: data.reset_date,
        });
      }
    } catch (error) {
      console.error("Error fetching AI usage:", error);
      setUsage(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsage();
  }, [user]);

  return { usage, loading, refetch: fetchUsage };
}
