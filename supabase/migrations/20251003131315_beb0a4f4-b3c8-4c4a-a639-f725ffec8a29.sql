-- Add DELETE policy for user_subscriptions table
-- Restricts deletion to the subscription owner only
CREATE POLICY "Users can delete their own subscription" 
ON public.user_subscriptions 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- This prevents accidental or malicious deletion of subscription data
-- even if RLS is temporarily misconfigured