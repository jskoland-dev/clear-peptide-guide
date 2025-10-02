-- Update free users to get 5 AI messages per month
UPDATE public.user_subscriptions
SET ai_message_limit = 5
WHERE status = 'free' AND ai_message_limit = 0;

-- Update the handle_new_user_subscription function to give new free users 5 AI messages
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.user_subscriptions (user_id, status, ai_message_limit, ai_messages_reset_date)
  VALUES (NEW.id, 'free', 5, now());
  RETURN NEW;
END;
$function$;