-- Create protocols table
CREATE TABLE public.protocols (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  peptide_name text NOT NULL,
  category text NOT NULL,
  recommended_dose text NOT NULL,
  frequency text NOT NULL,
  cycle_length text NOT NULL,
  expected_results text[] NOT NULL,
  common_stacks text[] NOT NULL,
  warnings text[] NOT NULL,
  description text NOT NULL,
  benefits text[] NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS on protocols (read-only for everyone)
ALTER TABLE public.protocols ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Protocols are viewable by everyone"
  ON public.protocols FOR SELECT
  USING (true);

-- Create user_saved_protocols table
CREATE TABLE public.user_saved_protocols (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  protocol_id uuid REFERENCES public.protocols(id) ON DELETE CASCADE NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, protocol_id)
);

-- Enable RLS on user_saved_protocols
ALTER TABLE public.user_saved_protocols ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own saved protocols"
  ON public.user_saved_protocols FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved protocols"
  ON public.user_saved_protocols FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved protocols"
  ON public.user_saved_protocols FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved protocols"
  ON public.user_saved_protocols FOR DELETE
  USING (auth.uid() = user_id);

-- Create protocol_reminders table
CREATE TABLE public.protocol_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  protocol_id uuid REFERENCES public.protocols(id) ON DELETE CASCADE NOT NULL,
  reminder_time time NOT NULL,
  reminder_days text[] NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS on protocol_reminders
ALTER TABLE public.protocol_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reminders"
  ON public.protocol_reminders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reminders"
  ON public.protocol_reminders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders"
  ON public.protocol_reminders FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reminders"
  ON public.protocol_reminders FOR DELETE
  USING (auth.uid() = user_id);

-- Insert pre-built protocols
INSERT INTO public.protocols (peptide_name, category, recommended_dose, frequency, cycle_length, expected_results, common_stacks, warnings, description, benefits) VALUES
(
  'BPC-157',
  'Injury Recovery',
  '250-500 mcg per injection',
  'Once or twice daily',
  '4-6 weeks',
  ARRAY['Accelerated healing of tendons and ligaments', 'Reduced inflammation', 'Improved gut health', 'Faster recovery from injuries'],
  ARRAY['TB-500 for enhanced tissue repair', 'Ipamorelin for recovery support'],
  ARRAY['May cause temporary fatigue', 'Consult doctor if pregnant or breastfeeding', 'Not FDA approved for human use', 'Start with lower dose to assess tolerance'],
  'BPC-157 (Body Protection Compound) is a synthetic peptide derived from a protective protein in the stomach. It has shown remarkable healing properties for soft tissue injuries, tendons, ligaments, and gut-related issues.',
  ARRAY['Accelerates wound healing', 'Protects and heals gut lining', 'Reduces inflammation', 'Promotes angiogenesis (blood vessel formation)', 'Supports tendon and ligament repair']
),
(
  'TB-500',
  'Tissue Repair',
  '2-2.5 mg per injection',
  'Twice weekly',
  '4-6 weeks',
  ARRAY['Enhanced muscle recovery', 'Improved flexibility', 'Reduced inflammation', 'Faster healing of injuries'],
  ARRAY['BPC-157 for comprehensive healing', 'CJC-1295 for muscle growth'],
  ARRAY['May cause temporary lethargy', 'Avoid during active cancer treatment', 'Not for use during pregnancy', 'Can cause mild headaches initially'],
  'TB-500 (Thymosin Beta-4) is a naturally occurring peptide that plays a crucial role in building new blood vessels, muscle tissue fibers, and cell migration. Widely used by athletes for injury recovery and performance enhancement.',
  ARRAY['Promotes tissue regeneration', 'Reduces inflammation and pain', 'Increases flexibility', 'Improves endurance', 'Supports cardiovascular health']
),
(
  'Ipamorelin',
  'Growth Hormone',
  '200-300 mcg per injection',
  'Once or twice daily (morning and/or before bed)',
  '8-12 weeks',
  ARRAY['Increased lean muscle mass', 'Improved sleep quality', 'Enhanced fat loss', 'Better recovery', 'Anti-aging effects'],
  ARRAY['CJC-1295 for synergistic GH release', 'GHRP-2 for enhanced results'],
  ARRAY['May cause hunger increase', 'Possible water retention initially', 'Inject on empty stomach for best results', 'Do not use if you have active cancer'],
  'Ipamorelin is a selective growth hormone secretagogue that stimulates the release of growth hormone from the pituitary gland. It is one of the cleanest GHRPs with minimal side effects and no effect on cortisol or prolactin levels.',
  ARRAY['Increases natural growth hormone production', 'Improves body composition', 'Enhances recovery and healing', 'Promotes better sleep', 'Supports anti-aging']
),
(
  'CJC-1295',
  'Muscle Growth',
  '1-2 mg per injection',
  'Once or twice weekly',
  '8-12 weeks',
  ARRAY['Increased muscle mass', 'Enhanced strength', 'Improved recovery', 'Better sleep', 'Increased IGF-1 levels'],
  ARRAY['Ipamorelin for optimal GH release', 'TB-500 for recovery enhancement'],
  ARRAY['May cause injection site irritation', 'Possible headaches initially', 'Monitor IGF-1 levels during use', 'Not recommended with active tumors'],
  'CJC-1295 (with or without DAC) is a growth hormone releasing hormone (GHRH) analog that increases growth hormone and IGF-1 levels. It works synergistically with GHRPs to maximize growth hormone release.',
  ARRAY['Sustained growth hormone elevation', 'Increases IGF-1 production', 'Promotes muscle growth and fat loss', 'Improves skin elasticity', 'Enhances immune function']
),
(
  'Semaglutide',
  'Weight Loss',
  'Start: 0.25 mg weekly, Maintain: 1-2.4 mg weekly',
  'Once weekly (same day each week)',
  '12+ weeks (long-term use)',
  ARRAY['Significant weight loss (10-15% body weight)', 'Reduced appetite', 'Better blood sugar control', 'Improved cardiovascular health'],
  ARRAY['Tirzepatide for enhanced results', 'L-Carnitine for fat metabolism'],
  ARRAY['Common: nausea, diarrhea, constipation', 'Rare: pancreatitis risk', 'Not for those with thyroid cancer history', 'Slow dose escalation required', 'May cause gallbladder issues'],
  'Semaglutide is a GLP-1 receptor agonist that mimics the incretin hormone GLP-1. It works by increasing insulin secretion, decreasing glucagon secretion, and slowing gastric emptying, leading to reduced appetite and significant weight loss.',
  ARRAY['Powerful appetite suppression', 'Sustained weight loss', 'Improved glycemic control', 'Cardiovascular benefits', 'Reduces food cravings']
),
(
  'Tesamorelin',
  'Fat Loss',
  '2 mg per injection',
  'Once daily (before bed)',
  '12+ weeks',
  ARRAY['Reduction in visceral fat', 'Improved body composition', 'Increased lean muscle', 'Enhanced metabolism', 'Better cognitive function'],
  ARRAY['Ipamorelin for additional GH support', 'CJC-1295 for muscle preservation'],
  ARRAY['May cause injection site reactions', 'Possible joint pain or swelling', 'Monitor glucose levels', 'Not for use with active cancer', 'Can affect insulin sensitivity'],
  'Tesamorelin is a growth hormone releasing hormone (GHRH) analog specifically approved for reducing excess abdominal fat. It is particularly effective at targeting visceral adipose tissue without affecting subcutaneous fat significantly.',
  ARRAY['Reduces visceral (belly) fat', 'Preserves lean muscle mass', 'Improves lipid profiles', 'Enhances cognitive function', 'Increases growth hormone levels']
);