import { z } from "zod";

// === Progress Photo Validation ===
export const progressPhotoSchema = z.object({
  weight: z.string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) > 0 && parseFloat(val) < 1000),
      { message: "Weight must be between 0 and 1000 lbs" }
    ),
  
  peptides: z.array(
    z.string()
      .min(1, "Peptide name cannot be empty")
      .max(50, "Peptide name too long (max 50 characters)")
      .regex(/^[a-zA-Z0-9\s\-]+$/, "Peptide name contains invalid characters")
  ).max(10, "Maximum 10 peptides allowed"),
  
  measurements: z.object({
    chest: z.string().optional().refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) > 0 && parseFloat(val) < 200),
      { message: "Measurement must be between 0 and 200 inches" }
    ),
    waist: z.string().optional().refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) > 0 && parseFloat(val) < 200),
      { message: "Measurement must be between 0 and 200 inches" }
    ),
    hips: z.string().optional().refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) > 0 && parseFloat(val) < 200),
      { message: "Measurement must be between 0 and 200 inches" }
    ),
    arms: z.string().optional().refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) > 0 && parseFloat(val) < 200),
      { message: "Measurement must be between 0 and 200 inches" }
    ),
    legs: z.string().optional().refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) > 0 && parseFloat(val) < 200),
      { message: "Measurement must be between 0 and 200 inches" }
    ),
  }),
  
  notes: z.string()
    .max(1000, "Notes must be less than 1000 characters")
    .optional(),
  
  file: z.instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "File size must be less than 5MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp", "image/heic"].includes(file.type),
      "Only JPEG, PNG, WebP, and HEIC images are allowed"
    ),
});

// === Vial Validation ===
export const vialSchema = z.object({
  peptideName: z.string()
    .min(1, "Peptide name is required")
    .max(100, "Peptide name too long")
    .regex(/^[a-zA-Z0-9\s\-]+$/, "Invalid characters in peptide name"),
  
  totalAmount: z.string()
    .min(1, "Total amount is required")
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0 && parseFloat(val) <= 100,
      { message: "Amount must be between 0 and 100 mg" }
    ),
  
  bacWater: z.string()
    .min(1, "BAC water amount is required")
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0 && parseFloat(val) <= 50,
      { message: "BAC water must be between 0 and 50 mL" }
    ),
  
  reconstitutionDate: z.string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date")
    .refine(
      (val) => new Date(val) <= new Date(),
      { message: "Reconstitution date cannot be in the future" }
    ),
  
  expirationDate: z.string()
    .optional()
    .refine(
      (val) => !val || !isNaN(Date.parse(val)),
      { message: "Invalid expiration date" }
    )
    .refine(
      (val) => !val || new Date(val) > new Date(),
      { message: "Expiration date must be in the future" }
    ),
  
  cost: z.string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0 && parseFloat(val) <= 10000),
      { message: "Cost must be between 0 and 10000" }
    ),
  
  notes: z.string()
    .max(500, "Notes must be less than 500 characters")
    .optional(),
});

// === Injection Validation ===
export const injectionSchema = z.object({
  peptideName: z.string()
    .min(1, "Peptide name is required")
    .max(100, "Peptide name too long"),
  
  doseAmount: z.string()
    .min(1, "Dose amount is required")
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0 && parseFloat(val) <= 100,
      { message: "Dose must be between 0 and 100" }
    ),
  
  doseUnit: z.enum(["mg", "mcg", "units", "IU"]),
  
  injectionSite: z.string()
    .min(1, "Injection site is required"),
  
  injectionDate: z.string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date")
    .refine(
      (val) => new Date(val) <= new Date(),
      { message: "Injection date cannot be in the future" }
    ),
  
  notes: z.string()
    .max(500, "Notes must be less than 500 characters")
    .optional(),
});

// === Daily Log Validation ===
export const dailyLogSchema = z.object({
  moodRating: z.number().int().min(1).max(10),
  sleepQuality: z.number().int().min(1).max(10),
  energyLevel: z.number().int().min(1).max(10),
  sorenessLevel: z.number().int().min(1).max(10),
  
  sideEffectsNotes: z.string()
    .max(500, "Side effects notes must be less than 500 characters")
    .optional(),
  
  positiveEffects: z.string()
    .max(1000, "Positive effects must be less than 1000 characters")
    .optional(),
  
  bodyWeight: z.string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) > 0 && parseFloat(val) < 1000),
      { message: "Weight must be between 0 and 1000 lbs" }
    ),
  
  bodyFatPercentage: z.string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0 && parseFloat(val) <= 100),
      { message: "Body fat percentage must be between 0 and 100" }
    ),
  
  notes: z.string()
    .max(1000, "Notes must be less than 1000 characters")
    .optional(),
});

// === Community Protocol Validation ===
export const communityProtocolSchema = z.object({
  title: z.string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters"),
  
  goal: z.enum([
    "fat_loss", "muscle_gain", "recovery", "anti_aging", 
    "cognitive", "sleep", "skin_health", "injury_healing", "general_wellness"
  ]),
  
  peptides: z.array(
    z.object({
      name: z.string()
        .min(1, "Peptide name is required")
        .max(50, "Peptide name too long"),
      dose: z.string()
        .min(1, "Dosage is required")
        .max(100, "Dosage description too long"),
    })
  )
  .min(1, "At least one peptide is required")
  .max(10, "Maximum 10 peptides allowed"),
  
  schedule: z.string()
    .min(3, "Schedule must be at least 3 characters")
    .max(200, "Schedule description too long"),
  
  duration: z.string()
    .min(2, "Duration must be at least 2 characters")
    .max(100, "Duration description too long"),
  
  results: z.string()
    .min(10, "Results must be at least 10 characters")
    .max(2000, "Results must be less than 2000 characters"),
  
  sideEffects: z.string()
    .max(1000, "Side effects must be less than 1000 characters")
    .optional(),
  
  notes: z.string()
    .max(1000, "Notes must be less than 1000 characters")
    .optional(),
});
