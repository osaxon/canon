// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import OpenAI from "https://deno.land/x/openai@v4.24.0/mod.ts";

const prompts = [
    "A futuristic cityscape with flying cars and a giant robot playing the saxophone on a rooftop.",
    "A serene underwater scene where mermaids are having a tea party with seahorses.",
    "A mystical forest with glowing mushrooms and owls wearing wizard hats.",
    "An alien family having a picnic on the moon with Earth as their backdrop.",
    "A steampunk-inspired carnival featuring robotic animals and hot air balloon rides.",
    "A group of penguins in tuxedos hosting a formal dance party in Antarctica.",
    "A surreal desert landscape with cactus towers and floating jellyfish.",
    "A giant bookshelf in the clouds with books transforming into colorful butterflies.",
    "A group of superheroes having a water balloon fight in zero gravity.",
    "A time-traveling tea party with historical figures like Shakespeare and Cleopatra.",
    "A tropical beach scene with surfing giraffes and coconut tree hammocks.",
    "A cyberpunk city where holographic cats are playing a game of chess.",
    "A floating island in the sky with waterfalls made of liquid rainbows.",
    "A group of friendly monsters having a picnic in a candy-filled meadow.",
    "A vintage space station with retro robots and astronauts playing musical instruments.",
    "A winter wonderland where polar bears are snowboarding down ice-covered mountains.",
    "A magical library where books come to life and tell their own stories.",
    "A group of alien chefs preparing a feast with intergalactic ingredients.",
    "A cityscape made entirely of neon lights and giant neon animals.",
    "A surreal garden with talking flowers and floating lanterns.",
    "A group of miniature elephants riding bicycles in a circus tent made of candy.",
    "A haunted mansion with friendly ghosts playing board games.",
    "A futuristic skate park on Mars with Martian creatures riding hoverboards.",
    "A rainbow-colored desert with sand dunes shaped like giant ice cream cones.",
    "A group of robots having a dance-off in a disco ball factory.",
    "A waterfall made of liquid metal flowing into a pool of glowing lava.",
    "A carnival on the back of a giant turtle, with roller coasters and Ferris wheels.",
    "A forest of giant mushrooms with fairies riding dragonflies.",
    "A space opera with musical planets and singing constellations.",
    "A group of wizards playing soccer with a magical ball that leaves a trail of sparkles.",
    "two birds in a tree",
];

/*
    {
  location: 'a pile of rubbish',
  subjects: [ 'rubbish', 'waste', 'garbage' ],
  actions: [ 'piling up', 'accumulating' ],
  mood: 'disarray'
}
    */

type ImageContext = {
    location: string;
    subjects: Array<string>;
    actions: Array<string>;
    mood: string;
};

Deno.serve(async (req) => {
    // pass an image context object
    let { prompt, imageContext } = (await req.json()) as {
        prompt: string; // from user client side
        imageContext: ImageContext; // pass from db
    };

    // imageContext passed as input
    // create new context based on prompt
    // merge both context files
    // overwrite location
    // merge subjects and actions
    // overrwrite mood

    if (!prompt) {
        prompt = prompts[Math.floor(Math.random() * prompts.length)];
    }

    const apiKey = Deno.env.get("OPENAI_API_KEY");

    const openai = new OpenAI({
        apiKey: apiKey,
    });

    // 1. CREATE IMAGE CONTEXT OBJECT
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `You are a helpful assistant designed to output JSON. Using the provided prompt, respond with a JSON object in the following format:
            location: <a single string>,
            subjects: <an array of subjects derived from the prompt>,
            actions: <an array of activities derived from the prompt>,
            mood: <a single string representative of the mood of the prompt>
            `,
            },
            {
                role: "user",
                content: prompt,
            },
        ],
        model: "gpt-3.5-turbo-1106", // or custom fine-tuned model ID
        response_format: { type: "json_object" },
    });

    if (!completion.choices[0].message.content) {
        throw new Error("failed to create image context");
    }

    console.log(completion.choices[0]);

    const newImageContext: {
        location: string;
        subjects: Array<string>;
        actions: Array<string>;
        mood: string;
    } = JSON.parse(completion.choices[0].message.content);

    // 2. MERGE THE CONTEXT OBJECTS
    // merged context
    // retain old context for subjects actions
    // replace for location and mood
    const mergedImageContext = {
        location: newImageContext.location,
        subjects: [...newImageContext.subjects, ...imageContext.subjects],
        actions: [...newImageContext.actions, ...imageContext.actions],
        mood: newImageContext.mood,
    };

    // 3. GENERATE THE IMAGE
    // use the image context object in prompt
    // need to pass prompt + context
    // A) create a string literal prompt with scene, objects etc.
    // B) create flattened prompt using chatGPT
    const revisedPrompt = `a ${mergedImageContext.mood} scene, in ${mergedImageContext.location} which depicts ${mergedImageContext.subjects}. ${mergedImageContext.actions} is happening in the scene.`;
    console.log(revisedPrompt, "<---- the revised prompt");

    const image = await openai.images.generate({
        prompt: revisedPrompt,
        model: "dall-e-3",
        n: 1,
        size: "1024x1024",
        response_format: "b64_json",
    });

    if (!image.data[0].b64_json) {
        throw new Error("edge function error generating image");
    }

    // 1. seed image i.e. the first one
    // start with initial prompt
    // generate the image
    // create the context object

    // 2. follow on images
    // input with context + user prompt
    // create a context from the user prompt

    return new Response(
        JSON.stringify({
            image: {
                ...image.data[0],
                original_prompt: prompt,
            },
            imageContext: mergedImageContext,
        }),
        {
            headers: { "Content-Type": "application/json" },
        }
    );
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/generate-image' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
