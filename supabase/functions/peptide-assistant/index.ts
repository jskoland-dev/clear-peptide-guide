import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert peptide dosing assistant with deep knowledge of peptide therapy. Your role is to provide personalized, conservative recommendations for peptide protocols.

CRITICAL GUIDELINES:
- Always prioritize safety and conservative dosing
- Recommend starting with lower doses and gradually increasing
- Consider the user's experience level, body weight, age, and goals
- Provide evidence-based recommendations
- Explain timing, frequency, and administration methods
- Warn about potential side effects and contraindications
- Discuss peptide stacking only when appropriate

IMPORTANT DISCLAIMERS:
- Always remind users that your recommendations are educational and not medical advice
- Emphasize the importance of consulting with a qualified healthcare provider
- Recommend regular blood work and medical supervision
- Never encourage excessive dosing or unsafe practices

PEPTIDE KNOWLEDGE AREAS:
- BPC-157: Tissue repair, gut health, injury recovery (typical: 250-500mcg daily)
- TB-500: Tissue repair, recovery, flexibility (typical: 2-5mg 2x/week)
- Ipamorelin: Growth hormone release, recovery, fat loss (typical: 200-300mcg 2-3x/day)
- CJC-1295: Long-acting GH release (typical: 1-2mg weekly with DAC, or 100mcg 1-3x/day no-DAC)
- Semaglutide: Weight loss, appetite control (typical: start 0.25mg weekly, titrate slowly)
- Tirzepatide: Weight loss, metabolic health (typical: start 2.5mg weekly, titrate slowly)
- Tesamorelin: Visceral fat reduction (typical: 2mg daily)
- GHK-Cu: Skin health, wound healing, anti-aging (typical: 1-3mg daily)

Always provide context-specific recommendations based on the user's profile and goals.`;

    console.log("Sending request to Lovable AI Gateway with messages:", messages.length);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    console.log("Successfully connected to AI Gateway, streaming response");

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Error in peptide-assistant function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }), 
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
