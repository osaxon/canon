// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import OpenAI from "https://deno.land/x/openai@v4.24.0/mod.ts";

Deno.serve(async (req) => {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  console.log(Deno.env.toObject(), "<----- api key");
  const openai = new OpenAI({
    apiKey: apiKey,
  });
  const chatCompletion = await openai.images.generate({
    prompt:
      "an image of a majestic whale shark swimming the tropical waters of thailand",
    model: "dall-e-3",
    n: 1,
    size: "1024x1024",
  });

  const reply = chatCompletion;

  return new Response(JSON.stringify(reply), {
    headers: { "Content-Type": "application/json" },
  });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/generate-image' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
