-- Update the handle_new_user_subscription trigger to set AI message limit
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_subscriptions (user_id, status, ai_message_limit, ai_messages_reset_date)
  VALUES (NEW.id, 'free', 0, now());
  RETURN NEW;
END;
$$;

-- Create trigger to set AI limits when user upgrades to premium
CREATE OR REPLACE FUNCTION public.handle_subscription_upgrade()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If status changed to premium, set the message limit
  IF NEW.status = 'premium' AND (OLD.status IS NULL OR OLD.status != 'premium') THEN
    NEW.ai_message_limit := 100;
    NEW.ai_messages_reset_date := now();
  END IF;
  
  -- If status changed from premium to something else, remove the limit
  IF OLD.status = 'premium' AND NEW.status != 'premium' THEN
    NEW.ai_message_limit := 0;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for subscription upgrades
DROP TRIGGER IF EXISTS on_subscription_upgrade ON public.user_subscriptions;
CREATE TRIGGER on_subscription_upgrade
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_subscription_upgrade();