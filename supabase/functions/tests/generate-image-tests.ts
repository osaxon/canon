import {
  assert,
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.210.0/assert/mod.ts";
import {
  createClient,
  SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js@2.23.0";

const apiKey = Deno.env.get("OPENAI_API_KEY");

const supabaseUrl =
  Deno.env.get("EXPO_PUBLIC_YOUR_REACT_NATIVE_SUPABASE_URL") ?? "";
const supabaseKey =
  Deno.env.get("EXPO_PUBLIC_YOUR_REACT_NATIVE_SUPABASE_ANON_KEY") ?? "";
const options = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
};

// Test the 'hello-world' function
const testHelloWorld = async () => {
  const client: SupabaseClient = createClient(
    supabaseUrl,
    supabaseKey,
    options,
  );

  // Invoke the 'hello-world' function with a parameter
  const { data: func_data, error: func_error } = await client.functions.invoke(
    "hello-world",
    {
      body: { name: "bar" },
    },
  );

  // Check for errors from the function invocation
  if (func_error) {
    throw new Error("Invalid response: " + func_error.message);
  }

  // Log the response from the function
  console.log(JSON.stringify(func_data, null, 2));

  // Assert that the function returned the expected result
  assertEquals(func_data.message, "Hello bar!");
};

Deno.test("Hello-world Function Test", testHelloWorld);
