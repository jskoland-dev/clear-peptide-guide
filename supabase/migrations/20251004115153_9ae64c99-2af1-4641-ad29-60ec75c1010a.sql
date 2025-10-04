-- First, let's clean up duplicate entries by keeping only one of each peptide
-- Delete duplicate GHK-Cu (keep the one with Nexaph URL)
DELETE FROM protocols WHERE peptide_name = 'GHK-Cu (Copper Peptide)';

-- Delete duplicate PT-141 (keep the one with Nexaph URL)  
DELETE FROM protocols WHERE peptide_name = 'PT-141 (Bremelanotide)' AND purchase_url = 'https://www.corepeptides.com/peptides/pt-141-10mg/';

-- Delete duplicate Thymosin Alpha-1 (keep the one with Core Peptides URL)
DELETE FROM protocols WHERE peptide_name = 'Thymosin Alpha-1' AND purchase_url = 'https://nexaph.com/product/thymosin-alpha-1-5mg-10-vials-kit/';

-- Update existing protocols to use Core Peptides URLs
UPDATE protocols SET purchase_url = 'https://www.corepeptides.com/peptides/bpc-157/' WHERE peptide_name = 'BPC-157';
UPDATE protocols SET purchase_url = 'https://www.corepeptides.com/peptides/tb-500/' WHERE peptide_name = 'TB-500';
UPDATE protocols SET purchase_url = 'https://www.corepeptides.com/peptides/semaglutide-glp-1/' WHERE peptide_name = 'Semaglutide';
UPDATE protocols SET purchase_url = 'https://www.corepeptides.com/peptides/tirzepatide/' WHERE peptide_name = 'Tirzepatide';
UPDATE protocols SET purchase_url = 'https://www.corepeptides.com/peptides/retatrutide-8mg/' WHERE peptide_name = 'Retatrutide';
UPDATE protocols SET purchase_url = 'https://www.corepeptides.com/peptides/cjc-1295-no-dac-mod-grf-1-29/' WHERE peptide_name = 'CJC-1295';
UPDATE protocols SET purchase_url = 'https://www.corepeptides.com/peptides/epitalon-25mg/' WHERE peptide_name = 'Epithalon';
UPDATE protocols SET purchase_url = 'https://www.corepeptides.com/peptides/ipamorelin-5mg/' WHERE peptide_name = 'Ipamorelin';
UPDATE protocols SET purchase_url = 'https://www.corepeptides.com/peptides/tesamorelin-10mg/' WHERE peptide_name = 'Tesamorelin';
UPDATE protocols SET purchase_url = 'https://www.corepeptides.com/peptides/mots-c-10mg/' WHERE peptide_name = 'MOTS-C';
UPDATE protocols SET purchase_url = 'https://www.corepeptides.com/peptides/ghk-cu-50mg-copper/' WHERE peptide_name = 'GHK-Cu';
UPDATE protocols SET purchase_url = 'https://www.corepeptides.com/peptides/selank-10mg/' WHERE peptide_name = 'Selank';
UPDATE protocols SET purchase_url = 'https://www.corepeptides.com/peptides/semax-25mg/' WHERE peptide_name = 'Semax';
UPDATE protocols SET purchase_url = 'https://www.corepeptides.com/peptides/aod-9604-5mg/' WHERE peptide_name = 'AOD-9604';
UPDATE protocols SET purchase_url = 'https://www.corepeptides.com/peptides/sermorelin-5mg/' WHERE peptide_name = 'Sermorelin';
UPDATE protocols SET purchase_url = 'https://www.corepeptides.com/peptides/nad-100mg-750mg/' WHERE peptide_name = 'NAD+';
UPDATE protocols SET purchase_url = 'https://www.corepeptides.com/peptides/kpv-4mg/' WHERE peptide_name = 'KPV';

-- Now add the major missing Core Peptides products
INSERT INTO protocols (peptide_name, category, recommended_dose, frequency, cycle_length, expected_results, common_stacks, warnings, description, benefits, purchase_url)
VALUES
-- GHRP-2
('GHRP-2', 'Growth Hormone', '100-300 mcg per injection', 'Once daily before bed', '3-6 months', 
ARRAY['Increased GH levels', 'Improved sleep quality', 'Enhanced recovery', 'Lean muscle gains'],
ARRAY['CJC-1295', 'Ipamorelin', 'Mod GRF 1-29'],
ARRAY['May increase appetite', 'Monitor for water retention', 'Consult healthcare provider before use'],
'Growth Hormone Releasing Peptide-2 is a synthetic ghrelin analogue that stimulates growth hormone release from the pituitary gland.',
ARRAY['Promotes GH secretion', 'Enhances muscle growth', 'Improves sleep architecture', 'Supports fat loss'],
'https://www.corepeptides.com/peptides/ghrp-2/'),

-- GHRP-6
('GHRP-6', 'Growth Hormone', '100-300 mcg per injection', 'Once daily before bed', '3-6 months',
ARRAY['Increased GH production', 'Appetite stimulation', 'Improved body composition', 'Better recovery'],
ARRAY['CJC-1295', 'Ipamorelin', 'Mod GRF 1-29'],
ARRAY['Increases appetite significantly', 'May cause water retention', 'Consult healthcare provider'],
'A potent growth hormone secretagogue that strongly stimulates GH release and increases appetite.',
ARRAY['Strong GH pulse', 'Appetite enhancement', 'Muscle building', 'Joint healing support'],
'https://www.corepeptides.com/peptides/ghrp-6/'),

-- Hexarelin
('Hexarelin', 'Growth Hormone', '100-200 mcg per injection', 'Once daily', '4-16 weeks cycles with breaks',
ARRAY['Powerful GH release', 'Muscle growth', 'Fat loss', 'Improved recovery'],
ARRAY['GHRP-2', 'CJC-1295', 'Ipamorelin'],
ARRAY['Can cause desensitization with prolonged use', 'Cycle on and off', 'Monitor cortisol levels'],
'The most potent GHRP that stimulates massive GH release but requires cycling to prevent desensitization.',
ARRAY['Strongest GH stimulation', 'Rapid muscle gains', 'Enhanced fat burning', 'Cardiovascular support'],
'https://www.corepeptides.com/peptides/hexarelin-5mg/'),

-- Gonadorelin
('Gonadorelin', 'Sexual Health', '100-200 mcg per injection', '2-3 times per week', 'Ongoing as needed',
ARRAY['Restored natural testosterone', 'Maintained fertility', 'Prevention of testicular atrophy'],
ARRAY['HCG', 'Clomid', 'Enclomiphene'],
ARRAY['Requires pulsatile dosing', 'May need pump for optimal results', 'Consult endocrinologist'],
'A GnRH analogue that stimulates natural LH and FSH production to maintain testosterone and fertility.',
ARRAY['Natural testosterone restoration', 'Fertility preservation', 'Prevents HPTA shutdown', 'Testicular function maintenance'],
'https://www.corepeptides.com/peptides/gonadorelin-10mg/'),

-- Kisspeptin-10
('Kisspeptin-10', 'Sexual Health', '1-4 mcg per kg body weight', '2-3 times per week', 'Ongoing as needed',
ARRAY['Enhanced libido', 'Improved fertility', 'Increased testosterone', 'Better reproductive health'],
ARRAY['PT-141', 'Gonadorelin', 'HCG'],
ARRAY['Research peptide', 'Effects on reproduction', 'Consult fertility specialist'],
'A peptide that stimulates the release of GnRH, improving reproductive hormone levels and sexual function.',
ARRAY['Boosts libido', 'Fertility enhancement', 'Natural testosterone increase', 'Reproductive hormone support'],
'https://www.corepeptides.com/peptides/kisspeptin-10mg/'),

-- Liraglutide
('Liraglutide', 'Weight Loss', '0.6-3.0 mg per day', 'Once daily', 'Ongoing for weight management',
ARRAY['Significant weight loss', 'Appetite suppression', 'Improved glycemic control', 'Cardiovascular benefits'],
ARRAY['Semaglutide', 'Tirzepatide', 'Metformin'],
ARRAY['Gastrointestinal side effects common', 'Slow titration required', 'Monitor for pancreatitis'],
'A GLP-1 receptor agonist approved for weight management and type 2 diabetes treatment.',
ARRAY['FDA approved for obesity', 'Appetite reduction', 'Blood sugar control', 'Heart health benefits'],
'https://www.corepeptides.com/peptides/liraglutide-glp-1-3mg/'),

-- MGF (Mechano Growth Factor)
('MGF', 'Muscle Growth', '200-400 mcg post-workout', 'Post-workout, 2-3 times per week', '4-6 weeks',
ARRAY['Accelerated muscle repair', 'New muscle fiber creation', 'Enhanced recovery', 'Injury healing'],
ARRAY['IGF-1 LR3', 'BPC-157', 'TB-500'],
ARRAY['Short half-life requires timely dosing', 'Localized injection for targeted effect', 'Research peptide'],
'Mechanical Growth Factor is a splice variant of IGF-1 that promotes muscle fiber repair and new cell growth.',
ARRAY['Muscle fiber hyperplasia', 'Rapid recovery', 'Satellite cell activation', 'Injury repair'],
'https://www.corepeptides.com/peptides/mgf-5mg/'),

-- PEG-MGF
('PEG-MGF', 'Muscle Growth', '200-400 mcg 2-3 times weekly', '2-3 times per week', '4-8 weeks',
ARRAY['Systemic muscle growth', 'Improved recovery', 'New muscle cell creation', 'Enhanced repair'],
ARRAY['IGF-1 LR3', 'BPC-157', 'TB-500'],
ARRAY['Longer acting than MGF', 'Monitor injection sites', 'Research peptide'],
'Pegylated Mechano Growth Factor with extended half-life for systemic muscle building effects.',
ARRAY['Long-lasting MGF effects', 'Full-body muscle growth', 'Recovery enhancement', 'Convenient dosing'],
'https://www.corepeptides.com/peptides/peg-mgf-5mg/'),

-- IGF-1 LR3
('IGF-1 LR3', 'Muscle Growth', '20-80 mcg per day', 'Once daily post-workout', '4-6 weeks with breaks',
ARRAY['Rapid muscle growth', 'Enhanced fat loss', 'Improved recovery', 'Increased strength'],
ARRAY['MGF', 'HGH', 'Insulin'],
ARRAY['Potent effects require respect', 'May cause hypoglycemia', 'Cycle on and off'],
'Long R3 IGF-1 is a modified version of IGF-1 with increased half-life and potency for muscle growth.',
ARRAY['Powerful anabolic effects', 'Hyperplasia induction', 'Fat metabolism', 'Nutrient partitioning'],
'https://www.corepeptides.com/peptides/receptor-grade-igf-1-lr3-1mg/'),

-- DSIP
('DSIP', 'Cognitive Enhancement', '100-300 mcg before bed', 'Daily before sleep', 'Ongoing as needed',
ARRAY['Improved sleep quality', 'Stress reduction', 'Better recovery', 'Mood enhancement'],
ARRAY['Selank', 'Semax', 'Melatonin'],
ARRAY['May cause drowsiness', 'Start with lower doses', 'Individual response varies'],
'Delta Sleep-Inducing Peptide promotes deep, restorative sleep and stress management.',
ARRAY['Sleep quality improvement', 'Stress hormone regulation', 'Recovery support', 'Mood stabilization'],
'https://www.corepeptides.com/peptides/dsip-5mg/'),

-- LL-37
('LL-37', 'Immune Support', '200-500 mcg per day', 'Once or twice daily', 'Ongoing for immune support',
ARRAY['Enhanced immune function', 'Antimicrobial effects', 'Wound healing', 'Reduced inflammation'],
ARRAY['Thymosin Alpha-1', 'BPC-157', 'TB-500'],
ARRAY['May cause injection site reactions', 'Monitor for immune response', 'Research peptide'],
'A naturally occurring antimicrobial peptide that supports immune function and fights infections.',
ARRAY['Broad-spectrum antimicrobial', 'Immune system modulation', 'Wound repair', 'Inflammation control'],
'https://www.corepeptides.com/peptides/ll-37-5mg/'),

-- Oxytocin
('Oxytocin', 'Sexual Health', '10-40 IU intranasally', '1-2 times daily as needed', 'As needed basis',
ARRAY['Enhanced bonding', 'Improved mood', 'Reduced stress', 'Better social function'],
ARRAY['PT-141', 'Kisspeptin-10'],
ARRAY['Individual sensitivity varies', 'May affect emotional responses', 'Use with caution'],
'The bonding hormone that enhances social connection, reduces stress, and improves emotional wellbeing.',
ARRAY['Social bonding', 'Stress reduction', 'Mood enhancement', 'Anxiety relief'],
'https://www.corepeptides.com/peptides/oxytocin-10mg/'),

-- Follistatin-344
('Follistatin-344', 'Muscle Growth', '100-300 mcg per day', 'Once daily', '10-30 days',
ARRAY['Rapid muscle growth', 'Myostatin inhibition', 'Increased strength', 'Lean mass gains'],
ARRAY['None typically', 'Can stack with standard protocols'],
ARRAY['Very potent effects', 'Short cycles only', 'Expensive peptide'],
'A myostatin inhibitor that removes the brakes on muscle growth for rapid gains.',
ARRAY['Myostatin blocking', 'Dramatic muscle increase', 'Strength gains', 'Lean tissue building'],
'https://www.corepeptides.com/peptides/follistatin-344-1mg/'),

-- Adipotide
('Adipotide', 'Fat Loss', '0.5-1.5 mg per day', 'Once daily', '4-8 weeks',
ARRAY['Targeted fat loss', 'Reduced fat cell blood supply', 'Improved body composition'],
ARRAY['None typically used alone'],
ARRAY['Very potent fat loss compound', 'May cause side effects', 'Requires careful monitoring'],
'A proapoptotic peptide that targets fat tissue blood supply for fat loss.',
ARRAY['Selective fat reduction', 'Fat cell apoptosis', 'Metabolic improvement', 'Body recomposition'],
'https://www.corepeptides.com/peptides/adipotide-10mg/'),

-- AICAR
('AICAR', 'Longevity', '50-150 mg per day', 'Once daily', '4-12 weeks',
ARRAY['Enhanced endurance', 'Improved metabolic function', 'Fat oxidation', 'Exercise mimetic effects'],
ARRAY['Metformin', 'Berberine', 'NAD+'],
ARRAY['May affect glucose metabolism', 'Monitor blood sugar', 'Research compound'],
'An AMPK activator that mimics exercise benefits and enhances metabolic health.',
ARRAY['Endurance boost', 'Metabolic activation', 'Fat burning', 'Exercise benefits without exercise'],
'https://www.corepeptides.com/peptides/aicar-50mg/'),

-- Humanin
('Humanin', 'Longevity', '2-5 mg per week', '2-3 times per week', 'Ongoing',
ARRAY['Neuroprotection', 'Metabolic benefits', 'Longevity support', 'Cellular health'],
ARRAY['MOTS-C', 'NAD+', 'Epithalon'],
ARRAY['Emerging research', 'Long-term effects being studied', 'Consult healthcare provider'],
'A mitochondrial-derived peptide with neuroprotective and anti-aging properties.',
ARRAY['Brain protection', 'Metabolic health', 'Longevity pathways', 'Cellular resilience'],
'https://www.corepeptides.com/peptides/humanin-10mg/'),

-- SS-31
('SS-31', 'Longevity', '5-10 mg per day', 'Once daily', 'Ongoing',
ARRAY['Mitochondrial support', 'Enhanced energy', 'Reduced oxidative stress', 'Improved cellular health'],
ARRAY['NAD+', 'MOTS-C', 'Coenzyme Q10'],
ARRAY['Premium peptide', 'Emerging research', 'Monitor for effects'],
'A mitochondria-targeting peptide that improves cellular energy production and reduces oxidative damage.',
ARRAY['Mitochondrial optimization', 'Energy enhancement', 'Antioxidant effects', 'Cellular longevity'],
'https://www.corepeptides.com/peptides/ss-31-50mg/'),

-- P21
('P21', 'Cognitive Enhancement', '1-10 mg per day', 'Once daily intranasal', 'Ongoing',
ARRAY['Enhanced neurogenesis', 'Improved learning', 'Better memory', 'Neuroprotection'],
ARRAY['Semax', 'Selank', 'Noopept'],
ARRAY['Individual response varies', 'May take weeks for effects', 'Research peptide'],
'A CNTF derivative that promotes neurogenesis and cognitive enhancement.',
ARRAY['New neuron formation', 'Cognitive boost', 'Brain health', 'Learning enhancement'],
'https://www.corepeptides.com/peptides/p21-5mg/'),

-- VIP
('VIP', 'Immune Support', '50-200 mcg intranasal', '1-3 times daily', 'Ongoing as needed',
ARRAY['Immune modulation', 'Anti-inflammatory effects', 'Respiratory support', 'Neuroprotection'],
ARRAY['Thymosin Alpha-1', 'LL-37'],
ARRAY['May cause facial flushing', 'Individual tolerance varies', 'Consult healthcare provider'],
'Vasoactive Intestinal Peptide regulates immune function and reduces inflammation.',
ARRAY['Immune regulation', 'Inflammation control', 'Respiratory health', 'Brain support'],
'https://www.corepeptides.com/peptides/vip-6mg/'),

-- ACE-031
('ACE-031', 'Muscle Growth', '1-3 mg per month', 'Once or twice monthly', '3-6 months',
ARRAY['Significant muscle growth', 'Myostatin inhibition', 'Increased strength'],
ARRAY['Standard bulking protocols'],
ARRAY['Very potent myostatin inhibitor', 'Infrequent dosing required', 'Research compound'],
'A decoy receptor that blocks myostatin and activin for dramatic muscle building.',
ARRAY['Myostatin blocking', 'Muscle mass increase', 'Strength gains', 'Long-lasting effects'],
'https://www.corepeptides.com/peptides/ace-031-1mg/'),

-- FOXO4-DRI
('FOXO4-DRI', 'Anti-Aging', '5-10 mg per day', 'Once daily', '7-14 days with long breaks',
ARRAY['Senescent cell removal', 'Anti-aging effects', 'Improved tissue health'],
ARRAY['NAD+', 'Epithalon'],
ARRAY['Senolytic effects', 'Requires cycling', 'Emerging research'],
'A senolytic peptide that selectively removes senescent zombie cells for anti-aging benefits.',
ARRAY['Cellular rejuvenation', 'Senescent cell clearance', 'Tissue renewal', 'Longevity support'],
'https://www.corepeptides.com/peptides/foxo4-dri-10mg/'),

-- Melanotan 1
('Melanotan 1', 'Tanning & Sexual Health', '250-500 mcg per day', 'Once daily', 'Until desired tan achieved',
ARRAY['Skin tanning', 'UV protection', 'Minimal side effects'],
ARRAY['Melanotan II'],
ARRAY['May cause nausea initially', 'Monitor skin changes', 'Use sun protection'],
'A safer melanotropin analog that promotes tanning with fewer side effects than MT2.',
ARRAY['Natural-looking tan', 'Photoprotection', 'Reduced side effects', 'Gradual pigmentation'],
'https://www.corepeptides.com/peptides/melanotan-1-10mg/');