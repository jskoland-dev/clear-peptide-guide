-- Insert new peptide protocols into the protocols table

-- 1. Retatrutide - Weight Loss
INSERT INTO public.protocols (
  peptide_name,
  category,
  recommended_dose,
  frequency,
  cycle_length,
  description,
  benefits,
  expected_results,
  common_stacks,
  warnings
) VALUES (
  'Retatrutide',
  'Weight Loss',
  '0.5-2mg per week (start low, titrate up)',
  'Once weekly subcutaneous injection',
  '12-24 weeks minimum',
  'Retatrutide is a powerful triple agonist targeting GLP-1, GIP, and glucagon receptors for advanced weight management. This cutting-edge peptide represents the next generation of metabolic therapy, offering superior results compared to dual agonists. Its unique mechanism addresses multiple pathways simultaneously for comprehensive weight loss support.',
  ARRAY['Superior weight loss results', 'Targets three metabolic pathways', 'Reduces appetite significantly', 'Improves insulin sensitivity', 'Preserves lean muscle mass'],
  ARRAY['10-20% body weight reduction in 6 months', 'Visible fat loss by week 4-6', 'Appetite control within days', 'Improved energy levels'],
  ARRAY['Standalone (very powerful)', 'Can combine with CJC-1295 for muscle preservation', 'Stack with L-Carnitine for enhanced fat burning'],
  ARRAY['Start with lowest dose to assess tolerance', 'Common side effects: nausea, fatigue in first weeks', 'Not for pregnant/nursing women', 'Monitor blood sugar if diabetic', 'Very potent - use cautiously']
);

-- 2. MOTS-C - Longevity
INSERT INTO public.protocols (
  peptide_name,
  category,
  recommended_dose,
  frequency,
  cycle_length,
  description,
  benefits,
  expected_results,
  common_stacks,
  warnings
) VALUES (
  'MOTS-C',
  'Longevity',
  '5-10mg per injection',
  '2-3 times per week or once every 5 days',
  '4-8 weeks, can run longer',
  'MOTS-C is a mitochondrial-derived peptide that plays a crucial role in metabolic regulation and healthy aging. This peptide optimizes mitochondrial function, the powerhouse of your cells, to enhance energy production and metabolic health. Research suggests it may help regulate metabolic homeostasis and support longevity pathways.',
  ARRAY['Enhances mitochondrial function', 'Improves insulin sensitivity', 'Supports healthy aging', 'Boosts exercise performance', 'Regulates metabolic balance', 'Anti-inflammatory effects'],
  ARRAY['Improved energy within 1-2 weeks', 'Better exercise endurance', 'Enhanced recovery', 'Metabolic improvements visible in 3-4 weeks'],
  ARRAY['BPC-157 for recovery', 'NAD+ for enhanced longevity effects', 'CJC-1295 + Ipamorelin for GH synergy'],
  ARRAY['Generally well-tolerated', 'May cause temporary fatigue as body adjusts', 'Consult doctor if metabolic disorders present', 'Research ongoing - not FDA approved']
);

-- 3. Tirzepatide - Weight Loss
INSERT INTO public.protocols (
  peptide_name,
  category,
  recommended_dose,
  frequency,
  cycle_length,
  description,
  benefits,
  expected_results,
  common_stacks,
  warnings
) VALUES (
  'Tirzepatide',
  'Weight Loss',
  '2.5-15mg per week (titrate gradually)',
  'Once weekly injection',
  '12-24 weeks minimum',
  'Tirzepatide is a dual GIP/GLP-1 receptor agonist that represents a breakthrough in weight management therapy. By activating both incretin receptors, it provides powerful appetite suppression and metabolic benefits. Clinical trials have shown remarkable weight loss results, making it one of the most effective peptides for body composition transformation.',
  ARRAY['Significant weight loss', 'Dual receptor activation', 'Reduces appetite and cravings', 'Improves glycemic control', 'Enhances insulin sensitivity', 'Supports cardiovascular health'],
  ARRAY['8-15% body weight reduction in 6 months', 'Noticeable appetite suppression within 1 week', 'Improved metabolic markers', 'Sustained weight loss with proper protocol'],
  ARRAY['Standalone protocol recommended', 'Can combine with CJC-1295 for muscle preservation', 'L-Carnitine for fat metabolism'],
  ARRAY['Start at lowest dose and titrate slowly', 'Common initial side effects: nausea, decreased appetite', 'Not suitable during pregnancy or breastfeeding', 'Monitor blood glucose if diabetic', 'Requires medical supervision']
);

-- 4. GHK-Cu - Anti-Aging
INSERT INTO public.protocols (
  peptide_name,
  category,
  recommended_dose,
  frequency,
  cycle_length,
  description,
  benefits,
  expected_results,
  common_stacks,
  warnings
) VALUES (
  'GHK-Cu',
  'Anti-Aging',
  '1-2mg per day',
  'Daily subcutaneous injection',
  '4-12 weeks',
  'GHK-Cu is a naturally occurring copper peptide with remarkable regenerative and anti-aging properties. This peptide stimulates collagen and elastin production while promoting tissue repair and remodeling. Its powerful antioxidant effects help protect against oxidative stress and support healthy skin aging.',
  ARRAY['Promotes collagen synthesis', 'Improves skin elasticity and firmness', 'Accelerates wound healing', 'Reduces fine lines and wrinkles', 'Enhances hair growth', 'Powerful antioxidant effects'],
  ARRAY['Visible skin improvement in 4-6 weeks', 'Enhanced wound healing', 'Improved skin texture and tone', 'Reduction in fine lines over 8-12 weeks'],
  ARRAY['BPC-157 for enhanced healing', 'TB-500 for tissue repair', 'Collagen peptides for synergistic effects'],
  ARRAY['Generally well-tolerated', 'May cause temporary redness at injection site', 'Avoid if copper allergy present', 'Consult dermatologist for skin conditions']
);

-- 5. Thymosin Alpha-1 - Immune Support
INSERT INTO public.protocols (
  peptide_name,
  category,
  recommended_dose,
  frequency,
  cycle_length,
  description,
  benefits,
  expected_results,
  common_stacks,
  warnings
) VALUES (
  'Thymosin Alpha-1',
  'Immune Support',
  '1.6-3.2mg per injection',
  '2-3 times per week',
  '4-8 weeks',
  'Thymosin Alpha-1 is a powerful immune-modulating peptide that enhances the body''s natural defense mechanisms. Originally derived from the thymus gland, it plays a crucial role in T-cell development and immune system function. This peptide is particularly valuable for supporting immune health during times of stress or illness.',
  ARRAY['Enhances immune system function', 'Supports T-cell development', 'Antiviral and antibacterial properties', 'Reduces inflammation', 'Improves vaccine response', 'Supports recovery from illness'],
  ARRAY['Improved immune response within 2-3 weeks', 'Reduced frequency of infections', 'Enhanced overall vitality', 'Better stress resilience'],
  ARRAY['BPC-157 for comprehensive healing', 'Vitamin D and Zinc for immune support', 'Can be used seasonally for prevention'],
  ARRAY['Generally safe with minimal side effects', 'May cause mild fatigue initially', 'Consult doctor if autoimmune conditions present', 'Not for use during active severe infections without medical guidance']
);

-- 6. Selank - Cognitive Enhancement
INSERT INTO public.protocols (
  peptide_name,
  category,
  recommended_dose,
  frequency,
  cycle_length,
  description,
  benefits,
  expected_results,
  common_stacks,
  warnings
) VALUES (
  'Selank',
  'Cognitive Enhancement',
  '250-500mcg per use',
  '1-3 times daily (nasal or injection)',
  '2-4 weeks, cycle off 1-2 weeks',
  'Selank is a synthetic peptide with powerful anxiolytic and nootropic properties. Developed in Russia, it enhances cognitive function while reducing anxiety without sedation. This peptide modulates brain-derived neurotrophic factor (BDNF) and influences serotonin metabolism for improved mental clarity and emotional balance.',
  ARRAY['Reduces anxiety without sedation', 'Enhances focus and concentration', 'Improves memory and learning', 'Stabilizes mood', 'Increases stress resilience', 'Neuroprotective effects'],
  ARRAY['Anxiety reduction within days', 'Improved mental clarity in 1-2 weeks', 'Enhanced cognitive performance', 'Better stress management'],
  ARRAY['Semax for enhanced cognitive effects', 'Lion''s Mane for neurogenesis', 'Noopept for synergistic nootropic benefits'],
  ARRAY['Generally well-tolerated', 'May cause drowsiness in some users', 'Cycle usage recommended to prevent tolerance', 'Consult doctor if on psychiatric medications']
);

-- 7. Semax - Cognitive Enhancement
INSERT INTO public.protocols (
  peptide_name,
  category,
  recommended_dose,
  frequency,
  cycle_length,
  description,
  benefits,
  expected_results,
  common_stacks,
  warnings
) VALUES (
  'Semax',
  'Cognitive Enhancement',
  '300-600mcg per use',
  '1-2 times daily (nasal or injection)',
  '2-4 weeks, cycle off 1-2 weeks',
  'Semax is a neuroprotective and cognitive-enhancing peptide that stimulates BDNF production and enhances neuroplasticity. Originally developed for treating cognitive disorders, it improves focus, memory, and mental energy. This peptide is particularly effective for mental performance and protecting against cognitive decline.',
  ARRAY['Enhances cognitive function', 'Improves focus and mental energy', 'Neuroprotective effects', 'Increases BDNF levels', 'Supports memory formation', 'Reduces mental fatigue'],
  ARRAY['Improved focus within hours', 'Enhanced memory over 2-3 weeks', 'Increased mental stamina', 'Better cognitive resilience'],
  ARRAY['Selank for balanced cognitive enhancement', 'Noopept for stronger effects', 'Alpha-GPC for cholinergic support'],
  ARRAY['Well-tolerated by most users', 'May cause mild stimulation', 'Use cycles to maintain effectiveness', 'Consult doctor if neurological conditions present']
);

-- 8. PT-141 (Bremelanotide) - Sexual Health
INSERT INTO public.protocols (
  peptide_name,
  category,
  recommended_dose,
  frequency,
  cycle_length,
  description,
  benefits,
  expected_results,
  common_stacks,
  warnings
) VALUES (
  'PT-141 (Bremelanotide)',
  'Sexual Health',
  '0.5-2mg per use',
  'As needed, 45 minutes before activity',
  'Use as needed, max 2-3x per week',
  'PT-141, also known as Bremelanotide, is a melanocortin receptor agonist that enhances sexual desire and arousal through the central nervous system. Unlike other treatments, it works on the brain''s desire pathways rather than vascular mechanisms. This peptide is effective for both men and women seeking to enhance libido and sexual satisfaction.',
  ARRAY['Enhances sexual desire and arousal', 'Works for both men and women', 'Acts on central nervous system', 'Improves sexual satisfaction', 'Not dependent on vascular function', 'Fast-acting effects'],
  ARRAY['Enhanced libido within 30-60 minutes', 'Improved arousal and satisfaction', 'Effects last 4-6 hours', 'Consistent response with proper dosing'],
  ARRAY['Generally used standalone', 'Can combine with lifestyle optimization', 'Testosterone optimization for men'],
  ARRAY['May cause flushing or nausea', 'Start with lower dose to assess tolerance', 'Not for use with uncontrolled hypertension', 'Temporary darkening of skin possible', 'Consult doctor if cardiovascular issues present']
);

-- 9. Melanotan II - Tanning & Sexual Health
INSERT INTO public.protocols (
  peptide_name,
  category,
  recommended_dose,
  frequency,
  cycle_length,
  description,
  benefits,
  expected_results,
  common_stacks,
  warnings
) VALUES (
  'Melanotan II',
  'Tanning & Sexual Health',
  '0.25-1mg per injection',
  'Daily or every other day',
  '4-8 weeks to reach desired tan',
  'Melanotan II is a melanocortin receptor agonist that stimulates melanogenesis for skin tanning and has secondary effects on libido. This peptide provides a tan without UV exposure, reducing sun damage risk. It also enhances sexual desire as a side benefit through its mechanism of action.',
  ARRAY['Stimulates natural tanning', 'Reduces UV exposure needed', 'Enhances libido', 'Provides photoprotection', 'Long-lasting tan', 'Reduces sunburn risk'],
  ARRAY['Visible tanning in 1-2 weeks', 'Desired tan achieved in 4-8 weeks', 'Enhanced libido effects', 'Tan maintenance with reduced dosing'],
  ARRAY['Use with minimal UV exposure for best results', 'Combine with proper sun protection', 'Can reduce frequency once desired tan achieved'],
  ARRAY['May cause nausea initially', 'Darkening of existing moles possible', 'Start with low dose to assess tolerance', 'Use sunscreen despite tanning effect', 'Not FDA approved - research chemical status']
);

-- 10. Epithalon - Longevity
INSERT INTO public.protocols (
  peptide_name,
  category,
  recommended_dose,
  frequency,
  cycle_length,
  description,
  benefits,
  expected_results,
  common_stacks,
  warnings
) VALUES (
  'Epithalon',
  'Longevity',
  '5-10mg per injection',
  'Once daily for 10-20 days',
  '10-20 days every 3-6 months',
  'Epithalon is a synthetic peptide that activates telomerase, the enzyme responsible for maintaining telomere length. Telomeres protect our DNA and their length is associated with cellular aging. This peptide may support healthy aging by promoting telomere elongation and cellular rejuvenation.',
  ARRAY['Activates telomerase enzyme', 'Supports telomere elongation', 'Promotes cellular rejuvenation', 'Regulates circadian rhythm', 'Enhances sleep quality', 'Supports healthy aging'],
  ARRAY['Improved sleep quality within days', 'Enhanced overall vitality', 'Better recovery and energy', 'Long-term cellular health support'],
  ARRAY['MOTS-C for metabolic synergy', 'NAD+ for enhanced longevity effects', 'Growth hormone peptides for comprehensive anti-aging'],
  ARRAY['Generally well-tolerated', 'Used in cycles for best results', 'Research ongoing on long-term effects', 'Consult doctor for personalized longevity protocols']
);