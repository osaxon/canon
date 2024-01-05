// Import required libraries and modules
import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.210.0/assert/mod.ts";
import {
  createClient,
  SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js@2.23.0";

// Set up the configuration for the Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const options = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
};

// Test the 'generate-image' function
const testGenerateImage = async () => {
  const client: SupabaseClient = createClient(
    supabaseUrl,
    supabaseKey,
    options,
  );

  // Invoke the 'generate-image' function with a parameter
  const { data: { data: func_data }, error: func_error } = await client
    .functions.invoke(
      "generate-image",
    );

  // Check for errors from the function invocation
  if (func_error) {
    throw new Error("Invalid response: " + func_error.message);
  }

  // Log the response from the function
  console.log(
    JSON.stringify(func_data, null, 2),
    "<---- the response from openai",
  );

  // Assert that the function returned the expected result
  assertExists(func_data[0].url);
};

// Register and run the tests
Deno.test("Generate Image Test", testGenerateImage);
