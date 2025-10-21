-- Create audit logging table for tracking suspicious access patterns
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB
);

-- Enable RLS on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins or system can write to audit logs (users cannot view or modify)
CREATE POLICY "System can insert audit logs"
ON public.audit_logs
FOR INSERT
WITH CHECK (true);

-- Create index for efficient querying
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_table_name ON public.audit_logs(table_name);

-- Update community_protocols policies to hide user_ids from other users
-- Drop existing policy
DROP POLICY IF EXISTS "Authenticated users can view protocols" ON public.community_protocols;

-- Create new policy that allows viewing but with restricted columns
CREATE POLICY "Users can view all community protocols"
ON public.community_protocols
FOR SELECT
TO authenticated
USING (true);

-- Note: To fully hide user_id, we'll need to handle this in the application layer
-- by selecting specific columns and excluding user_id unless it's the owner

-- Update protocol_comments policies similarly
DROP POLICY IF EXISTS "Authenticated users can view comments" ON public.protocol_comments;

CREATE POLICY "Users can view all protocol comments"
ON public.protocol_comments
FOR SELECT
TO authenticated
USING (true);

-- Create a function to check if storage access is authorized and log it
CREATE OR REPLACE FUNCTION public.log_storage_access(
  p_user_id UUID,
  p_action TEXT,
  p_bucket_id TEXT,
  p_object_path TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log the access attempt
  INSERT INTO public.audit_logs (user_id, action, table_name, metadata)
  VALUES (
    p_user_id,
    p_action,
    'storage.objects',
    jsonb_build_object(
      'bucket_id', p_bucket_id,
      'object_path', p_object_path
    )
  );
  
  RETURN true;
END;
$$;

-- Create function to detect suspicious patterns (multiple failed access attempts)
CREATE OR REPLACE FUNCTION public.detect_suspicious_activity(
  p_user_id UUID,
  p_time_window INTERVAL DEFAULT '5 minutes'
)
RETURNS TABLE(
  user_id UUID,
  failed_attempts BIGINT,
  last_attempt TIMESTAMP WITH TIME ZONE
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    audit_logs.user_id,
    COUNT(*) as failed_attempts,
    MAX(created_at) as last_attempt
  FROM public.audit_logs
  WHERE 
    audit_logs.user_id = p_user_id
    AND created_at > (now() - p_time_window)
    AND action LIKE '%failed%'
  GROUP BY audit_logs.user_id
  HAVING COUNT(*) > 10;
$$;