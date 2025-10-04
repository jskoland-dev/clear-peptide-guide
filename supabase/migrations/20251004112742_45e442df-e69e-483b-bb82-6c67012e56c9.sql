-- Add Core Peptides unique peptides to the protocols table

-- Fragment 176-191 (HGH Fragment)
INSERT INTO public.protocols (
  peptide_name,
  category,
  recommended_dose,
  frequency,
  cycle_length,
  expected_results,
  common_stacks,
  warnings,
  description,
  benefits,
  purchase_url
) VALUES (
  'Fragment 176-191',
  'Fat Loss',
  '250-500mcg per day',
  'Once daily, preferably before cardio',
  '3-6 months',
  ARRAY['Accelerated fat loss', 'Improved body composition', 'No effect on blood sugar', 'Preserves lean muscle mass'],
  ARRAY['CJC-1295', 'Ipamorelin', 'Semaglutide'],
  ARRAY['Inject on empty stomach', 'Avoid food 2-3 hours before and 1 hour after injection', 'May cause injection site irritation', 'Not for use during pregnancy'],
  'Fragment 176-191 is a modified form of amino acids 176-191 of human growth hormone. This peptide fragment works by mimicking the way natural HGH regulates fat metabolism without the adverse effects on blood sugar or growth that are seen with unmodified HGH.',
  ARRAY['Accelerates lipolysis (fat breakdown)', 'No impact on insulin sensitivity', 'Preserves lean muscle tissue', 'May improve overall body composition', 'No effect on blood sugar levels'],
  'https://www.corepeptides.com/peptides/fragment-176-191-5mg/'
);

-- PT-141 (Bremelanotide)
INSERT INTO public.protocols (
  peptide_name,
  category,
  recommended_dose,
  frequency,
  cycle_length,
  expected_results,
  common_stacks,
  warnings,
  description,
  benefits,
  purchase_url
) VALUES (
  'PT-141 (Bremelanotide)',
  'Sexual Health',
  '1-2mg per dose',
  'As needed, 45 minutes before activity',
  'Use as needed',
  ARRAY['Enhanced libido', 'Improved sexual function', 'Effects within 45-60 minutes', 'Benefits last 4-6 hours'],
  ARRAY['Melanotan II', 'Cialis', 'Testosterone'],
  ARRAY['May cause nausea in some users', 'Can cause facial flushing', 'May temporarily increase blood pressure', 'Start with lower dose to assess tolerance'],
  'PT-141 (Bremelanotide) is a melanocortin receptor agonist that works through the nervous system to enhance sexual desire and function. Unlike other treatments, it works on the brain rather than the vascular system.',
  ARRAY['Increases sexual desire and arousal', 'Works for both men and women', 'Does not require cardiovascular function', 'Can improve overall sexual satisfaction', 'Non-hormonal mechanism'],
  'https://www.corepeptides.com/peptides/pt-141-10mg/'
);

-- Melanotan II
INSERT INTO public.protocols (
  peptide_name,
  category,
  recommended_dose,
  frequency,
  cycle_length,
  expected_results,
  common_stacks,
  warnings,
  description,
  benefits,
  purchase_url
) VALUES (
  'Melanotan II',
  'Tanning & Sexual Health',
  '0.25-1mg per day',
  'Daily during loading phase, then as needed',
  'Loading phase: 1-2 weeks, Maintenance: as needed',
  ARRAY['Enhanced skin tanning', 'Increased libido', 'Reduced appetite', 'Visible tan within 1-2 weeks'],
  ARRAY['PT-141', 'UV exposure (moderate)'],
  ARRAY['Always start with low dose (0.25mg)', 'May cause nausea initially', 'Can cause facial flushing', 'Darkens existing moles and freckles', 'Requires some UV exposure for tanning'],
  'Melanotan II is a synthetic peptide that stimulates melanogenesis, leading to skin darkening. It also has effects on libido and appetite through melanocortin receptor activation.',
  ARRAY['Provides natural-looking tan', 'Reduces need for sun exposure', 'May increase libido', 'Can reduce appetite', 'Offers some photoprotection'],
  'https://www.corepeptides.com/peptides/melanotan-2-10mg/'
);

-- GHK-Cu (Copper Peptide)
INSERT INTO public.protocols (
  peptide_name,
  category,
  recommended_dose,
  frequency,
  cycle_length,
  expected_results,
  common_stacks,
  warnings,
  description,
  benefits,
  purchase_url
) VALUES (
  'GHK-Cu (Copper Peptide)',
  'Anti-Aging',
  '1-3mg per day (subcutaneous) or topical application',
  'Daily',
  '3-6 months',
  ARRAY['Improved skin appearance', 'Enhanced wound healing', 'Increased collagen production', 'Reduced fine lines and wrinkles'],
  ARRAY['BPC-157', 'TB-500', 'Collagen supplementation'],
  ARRAY['May cause blue discoloration at injection site', 'Use sterile technique', 'Can cause mild irritation with topical use', 'Consult healthcare provider if on copper-restricted diet'],
  'GHK-Cu is a naturally occurring copper complex that was first identified in human plasma but declines with age. It has powerful regenerative and anti-aging properties, particularly for skin health and tissue remodeling.',
  ARRAY['Stimulates collagen and elastin production', 'Promotes wound healing', 'Anti-inflammatory effects', 'Improves skin firmness and elasticity', 'May support hair growth', 'Antioxidant properties'],
  'https://www.corepeptides.com/peptides/ghk-cu-50mg/'
);

-- Thymosin Alpha-1
INSERT INTO public.protocols (
  peptide_name,
  category,
  recommended_dose,
  frequency,
  cycle_length,
  expected_results,
  common_stacks,
  warnings,
  description,
  benefits,
  purchase_url
) VALUES (
  'Thymosin Alpha-1',
  'Immune Support',
  '1.6mg per dose',
  'Twice weekly',
  '3-6 months',
  ARRAY['Enhanced immune function', 'Improved recovery from illness', 'Better overall wellness', 'May reduce infection frequency'],
  ARRAY['Vitamin D', 'Zinc', 'BPC-157'],
  ARRAY['May cause mild injection site reactions', 'Consult healthcare provider if immunocompromised', 'Use sterile injection technique', 'Not recommended during active infections without medical supervision'],
  'Thymosin Alpha-1 is a peptide naturally produced by the thymus gland that plays a crucial role in immune system function. It modulates immune responses and has been studied extensively for immune enhancement and infectious disease treatment.',
  ARRAY['Enhances T-cell function', 'Modulates immune response', 'May help fight viral infections', 'Supports overall immune health', 'Anti-inflammatory properties', 'May improve vaccine response'],
  'https://www.corepeptides.com/peptides/thymosin-alpha-1-5mg/'
);

-- CJC-1295 DAC (different from NO DAC version)
INSERT INTO public.protocols (
  peptide_name,
  category,
  recommended_dose,
  frequency,
  cycle_length,
  expected_results,
  common_stacks,
  warnings,
  description,
  benefits,
  purchase_url
) VALUES (
  'CJC-1295 DAC',
  'Growth Hormone',
  '2mg per dose',
  'Once or twice weekly',
  '3-6 months',
  ARRAY['Increased muscle growth', 'Enhanced fat loss', 'Improved recovery', 'Better sleep quality', 'Elevated IGF-1 levels'],
  ARRAY['Ipamorelin', 'Hexarelin', 'MK-677'],
  ARRAY['May cause water retention', 'Can increase hunger', 'May affect blood sugar levels', 'Requires less frequent dosing than NO DAC version', 'Monitor for injection site reactions'],
  'CJC-1295 with DAC (Drug Affinity Complex) is a long-acting growth hormone releasing hormone (GHRH) analog. The DAC extends its half-life to about a week, providing sustained GH elevation with less frequent dosing compared to the NO DAC version.',
  ARRAY['Long-acting formulation (weekly dosing)', 'Sustained growth hormone elevation', 'Improved body composition', 'Enhanced recovery and repair', 'Better sleep quality', 'Increased protein synthesis'],
  'https://www.corepeptides.com/peptides/cjc-1295-dac-5mg/'
);

-- Update existing peptides to include Core Peptides URLs where they overlap
UPDATE public.protocols
SET purchase_url = 'https://www.corepeptides.com/peptides/bpc-157/'
WHERE peptide_name = 'BPC-157' AND (purchase_url IS NULL OR purchase_url = '');

UPDATE public.protocols
SET purchase_url = 'https://www.corepeptides.com/peptides/tb-500-5mg/'
WHERE peptide_name = 'TB-500' AND (purchase_url IS NULL OR purchase_url = '');

UPDATE public.protocols
SET purchase_url = 'https://www.corepeptides.com/peptides/semaglutide-glp-1/'
WHERE peptide_name = 'Semaglutide' AND (purchase_url IS NULL OR purchase_url = '');

UPDATE public.protocols
SET purchase_url = 'https://www.corepeptides.com/peptides/tirzepatide-glp-1-gip/'
WHERE peptide_name = 'Tirzepatide' AND (purchase_url IS NULL OR purchase_url = '');

UPDATE public.protocols
SET purchase_url = 'https://www.corepeptides.com/peptides/retatrutide-15mg/'
WHERE peptide_name = 'Retatrutide' AND (purchase_url IS NULL OR purchase_url = '');