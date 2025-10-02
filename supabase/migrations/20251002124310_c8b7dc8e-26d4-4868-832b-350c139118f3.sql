-- Create peptide_stack_templates table
CREATE TABLE public.peptide_stack_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  peptides JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.peptide_stack_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own stack templates"
ON public.peptide_stack_templates
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own stack templates"
ON public.peptide_stack_templates
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stack templates"
ON public.peptide_stack_templates
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stack templates"
ON public.peptide_stack_templates
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_peptide_stack_templates_updated_at
BEFORE UPDATE ON public.peptide_stack_templates
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();