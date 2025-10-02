-- Add AI usage tracking columns to user_subscriptions table
ALTER TABLE public.user_subscriptions
ADD COLUMN ai_message_count INTEGER NOT NULL DEFAULT 0,
ADD COLUMN ai_message_limit INTEGER NOT NULL DEFAULT 0,
ADD COLUMN ai_messages_reset_date TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Update existing premium users to have 100 message limit
UPDATE public.user_subscriptions
SET ai_message_limit = 100,
    ai_messages_reset_date = now()
WHERE status = 'premium';

-- Create function to check and increment AI message usage
CREATE OR REPLACE FUNCTION public.check_and_increment_ai_usage(p_user_id UUID)
RETURNS TABLE(allowed BOOLEAN, remaining INTEGER, limit_value INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER;
  v_limit INTEGER;
  v_reset_date TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get current usage and limit
  SELECT ai_message_count, ai_message_limit, ai_messages_reset_date
  INTO v_count, v_limit, v_reset_date
  FROM public.user_subscriptions
  WHERE user_id = p_user_id;

  -- If user not found, return not allowed
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 0, 0;
    RETURN;
  END IF;

  -- Check if we need to reset the counter (monthly reset)
  IF v_reset_date + INTERVAL '1 month' < now() THEN
    v_count := 0;
    UPDATE public.user_subscriptions
    SET ai_message_count = 0,
        ai_messages_reset_date = now()
    WHERE user_id = p_user_id;
  END IF;

  -- Check if user has messages remaining
  IF v_count >= v_limit THEN
    RETURN QUERY SELECT false, 0, v_limit;
    RETURN;
  END IF;

  -- Increment counter
  UPDATE public.user_subscriptions
  SET ai_message_count = ai_message_count + 1
  WHERE user_id = p_user_id;

  -- Return success with remaining messages
  RETURN QUERY SELECT true, v_limit - (v_count + 1), v_limit;
END;
$$;

-- Create function to get current AI usage without incrementing
CREATE OR REPLACE FUNCTION public.get_ai_usage(p_user_id UUID)
RETURNS TABLE(used INTEGER, remaining INTEGER, limit_value INTEGER, reset_date TIMESTAMP WITH TIME ZONE)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER;
  v_limit INTEGER;
  v_reset_date TIMESTAMP WITH TIME ZONE;
BEGIN
  SELECT ai_message_count, ai_message_limit, ai_messages_reset_date
  INTO v_count, v_limit, v_reset_date
  FROM public.user_subscriptions
  WHERE user_id = p_user_id;

  IF NOT FOUND THEN
    RETURN QUERY SELECT 0, 0, 0, now();
    RETURN;
  END IF;

  -- Check if we need to reset
  IF v_reset_date + INTERVAL '1 month' < now() THEN
    v_count := 0;
    v_reset_date := now();
  END IF;

  RETURN QUERY SELECT v_count, v_limit - v_count, v_limit, v_reset_date;
END;
$$;