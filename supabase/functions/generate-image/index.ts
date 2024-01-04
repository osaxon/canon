import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import OpenAI from "openai";
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY") });

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
];

serve(async (req) => {
  const { prompt } = await req.json() ||
    prompts[Math.floor(Math.random() * prompts.length - 1)];

  const image = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: "1024x1024",
  });

  return new Response(
    JSON.stringify(image),
    { headers: { "Content-Type": "application/json" } },
  );
});
