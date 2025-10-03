-- Add purchase_url column to protocols table
ALTER TABLE public.protocols ADD COLUMN IF NOT EXISTS purchase_url text;

-- Update existing protocols with Nexaph URLs
UPDATE public.protocols SET purchase_url = 'https://nexaph.com/product/bpc-157/' WHERE peptide_name = 'BPC-157';
UPDATE public.protocols SET purchase_url = 'https://nexaph.com/product/tirzepatide/' WHERE peptide_name = 'Tirzepatide';
UPDATE public.protocols SET purchase_url = 'https://nexaph.com/product/semaglutide-5mg/' WHERE peptide_name = 'Semaglutide';
UPDATE public.protocols SET purchase_url = 'https://nexaph.com/product/retatrutide/' WHERE peptide_name = 'Retatrutide';
UPDATE public.protocols SET purchase_url = 'https://nexaph.com/product/tesamorelin-10mg/' WHERE peptide_name = 'Tesamorelin';
UPDATE public.protocols SET purchase_url = 'https://nexaph.com/product/ipamorelin-10mg/' WHERE peptide_name = 'Ipamorelin';
UPDATE public.protocols SET purchase_url = 'https://nexaph.com/product/ghk-cu-lyophilized-10-vials-kit/' WHERE peptide_name = 'GHK-Cu';
UPDATE public.protocols SET purchase_url = 'https://nexaph.com/product/mots-c-10mg-10-vials-kit/' WHERE peptide_name = 'MOTS-C';
UPDATE public.protocols SET purchase_url = 'https://nexaph.com/product/pt-141-10mg-10-vials-kit/' WHERE peptide_name = 'PT-141 (Bremelanotide)';
UPDATE public.protocols SET purchase_url = 'https://nexaph.com/product/thymosin-alpha-1-5mg-10-vials-kit/' WHERE peptide_name = 'Thymosin Alpha-1';
UPDATE public.protocols SET purchase_url = 'https://nexaph.com/product/thymosin-beta-4/' WHERE peptide_name = 'TB-500';
UPDATE public.protocols SET purchase_url = 'https://nexaph.com/product/melanotan-ii-10mg-10-vials-kit/' WHERE peptide_name = 'Melanotan II';
UPDATE public.protocols SET purchase_url = 'https://nexaph.com/product/n-acetyl-semax-amidate-10mg-10-vials-kit/' WHERE peptide_name = 'Semax';
UPDATE public.protocols SET purchase_url = 'https://nexaph.com/product/n-acetyl-selank-amidate-10mg-10-vials-kit/' WHERE peptide_name = 'Selank';

-- Insert missing peptides from Nexaph
INSERT INTO public.protocols (peptide_name, category, description, recommended_dose, frequency, cycle_length, benefits, expected_results, common_stacks, warnings, purchase_url) VALUES
('Cagrilintide', 'Weight Loss', 'Cagrilintide is a long-acting amylin analogue that helps regulate appetite and food intake. It works by slowing gastric emptying and promoting feelings of fullness.', '2.4-5mg per week', 'Once weekly', '12-16 weeks', 
ARRAY['Appetite suppression', 'Slowed gastric emptying', 'Weight loss support', 'Improved glycemic control', 'Enhanced satiety'],
ARRAY['Significant weight loss within 12-16 weeks', 'Reduced appetite and cravings', 'Better blood sugar regulation', 'Improved eating behaviors'],
ARRAY['Tirzepatide', 'Semaglutide', 'Retatrutide'],
ARRAY['May cause nausea initially', 'Start with low dose', 'Monitor for hypoglycemia if diabetic', 'Consult healthcare provider before use'],
'https://nexaph.com/product/cagrilintide-5mg/'),

('NAD+', 'Longevity', 'NAD+ (Nicotinamide Adenine Dinucleotide) is a crucial coenzyme involved in cellular energy production and DNA repair. Supplementation may support healthy aging and metabolic function.', '250-500mg per dose', '1-2 times per week', '4-12 weeks',
ARRAY['Enhanced cellular energy', 'DNA repair support', 'Improved mitochondrial function', 'Anti-aging effects', 'Cognitive support'],
ARRAY['Increased energy levels', 'Better mental clarity', 'Improved metabolic health', 'Enhanced recovery'],
ARRAY['MOTS-C', 'Epithalon', 'GHK-Cu'],
ARRAY['May cause flushing', 'Start with lower doses', 'Inject slowly to minimize discomfort', 'Consult healthcare provider'],
'https://nexaph.com/product/nad-500mg-10-vials-kit/'),

('KPV', 'Immune Support', 'KPV (Lysine-Proline-Valine) is an anti-inflammatory peptide that helps modulate immune response and reduce inflammation. It shows promise for inflammatory conditions.', '500mcg-1mg per dose', 'Once or twice daily', '4-8 weeks',
ARRAY['Anti-inflammatory effects', 'Immune modulation', 'Gut health support', 'Wound healing', 'Reduced inflammatory markers'],
ARRAY['Decreased inflammation', 'Improved gut health', 'Better immune function', 'Enhanced recovery from inflammatory conditions'],
ARRAY['BPC-157', 'TB-500', 'Thymosin Alpha-1'],
ARRAY['Generally well-tolerated', 'Monitor for individual response', 'Consult healthcare provider', 'May interact with immune medications'],
'https://nexaph.com/product/kpv-10mg-10-vials-kit/'),

('Sermorelin', 'Growth Hormone', 'Sermorelin is a growth hormone releasing hormone (GHRH) analogue that stimulates natural production of growth hormone. It supports muscle growth, fat loss, and recovery.', '200-300mcg per dose', 'Once daily before bed', '3-6 months',
ARRAY['Increased natural GH production', 'Improved sleep quality', 'Enhanced muscle growth', 'Fat loss', 'Better recovery'],
ARRAY['Noticeable improvements in sleep within 1-2 weeks', 'Increased muscle mass over 3-6 months', 'Reduced body fat', 'Better recovery and energy'],
ARRAY['Ipamorelin', 'CJC-1295', 'MOTS-C'],
ARRAY['May cause injection site reactions', 'Take on empty stomach', 'Timing important for best results', 'Consult healthcare provider'],
'https://nexaph.com/product/sermorelin-5mg-10-vials-kit/'),

('AOD-9604', 'Fat Loss', 'AOD-9604 is a modified fragment of human growth hormone that specifically targets fat loss without affecting blood sugar or tissue growth. It stimulates lipolysis and inhibits lipogenesis.', '300-500mcg per dose', 'Once daily', '12-16 weeks',
ARRAY['Targeted fat loss', 'No impact on blood sugar', 'Enhanced metabolism', 'Preservation of lean muscle', 'Improved body composition'],
ARRAY['Noticeable fat loss within 8-12 weeks', 'Improved body composition', 'Better metabolic rate', 'No muscle loss'],
ARRAY['Tesamorelin', 'Ipamorelin', '5-Amino-1MQ'],
ARRAY['Generally well-tolerated', 'Best taken on empty stomach', 'Avoid eating 2 hours after injection', 'Consult healthcare provider'],
'https://nexaph.com/product/aod-2mg-10-vials-kit/'),

('5-Amino-1MQ', 'Weight Loss', '5-Amino-1MQ is a small molecule that inhibits the enzyme NNMT, leading to increased cellular NAD+ levels and enhanced fat metabolism. It promotes weight loss without stimulant effects.', '50-100mg per dose', 'Once daily', '8-12 weeks',
ARRAY['Enhanced fat metabolism', 'Increased NAD+ levels', 'Weight loss without stimulants', 'Improved energy metabolism', 'Cellular health support'],
ARRAY['Progressive weight loss over 8-12 weeks', 'Increased energy expenditure', 'Better metabolic function', 'Reduced fat storage'],
ARRAY['NAD+', 'AOD-9604', 'Semaglutide'],
ARRAY['May cause mild nausea initially', 'Well-tolerated at recommended doses', 'Monitor body composition changes', 'Consult healthcare provider'],
'https://nexaph.com/product/5-amino-1mq-chloride-20mg-10-vials-kit/');
