import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("ONSPACE_AI_API_KEY");
    const baseUrl = Deno.env.get("ONSPACE_AI_BASE_URL");

    const { messages, context, language, mode } = await req.json();

    const systemPrompt = `You are an expert Android & React Native development AI assistant for eSmart World App Builder — a professional IDE platform created by Dr. Irfan.

Your specialties:
- Android development (Kotlin, Java, XML layouts, Gradle)
- React Native development (TypeScript, JSX, Expo)
- UI/UX design for mobile apps
- Code debugging, optimization, and best practices
- App architecture (MVVM, Clean Architecture, Redux)
- Firebase, REST APIs, databases integration
- Play Store deployment and release management

Current context:
- Language/Framework: ${language || "Kotlin"}
- Mode: ${mode || "general"}
- Platform: eSmart World App Builder v2.0

${context ? `Project context:\n${context}` : ""}

Guidelines:
- Always provide production-ready, well-commented code
- Suggest best practices and modern patterns
- For Kotlin: use coroutines, ViewBinding, Jetpack components
- For React Native: use hooks, TypeScript, functional components
- Provide complete code examples with imports
- Explain WHY, not just WHAT
- Be concise but thorough`;

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("AI API error:", error);
      return new Response(JSON.stringify({ error: `AI: ${error}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Stream the response back
    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
