# Canon

A social app that provides a unique experience for users by combining a collaboration with a generative image model.

[Video demo](https://youtu.be/_wKf7Eazt8Q)

## Tech stack

- **TypeScript**: App developed with strict TypeScript configuration to ensure type safety between client and backend
- **React Native**: Designed to work on web, Android and iOS
- **Supabase**: Supabase provides all backend services including Postgres database, authentication and image storage
- **OpenAI**: GPT and DALL-E models used to generate images
- **Deno**: Supabase Edge functions interface with OpenAI using Deno runtime

## Motiviation

The idea for the app came from a game where people in a group write a sentence on a piece of paper and the next person draws what's in the sentence. The original sentence is then hidden from the next player and they must add a new sentence based on the drawing.

Our app plays on this idea by initially generating a random seed image to share on a social feed. Users can then view the story on the feed and add the next image in the scene by providing a new prompt. Once a user has added the next image in the series, the full story is revealed to them along with the prompts that generated the images.

## Challenges

As the core idea of the app is underpinned by the generation of images in a consistent way, the biggest challenge during development was engineering the prompts in such a way that DALL-E could reference previously generated images in the story.

To overcome this challenge, the GPT model is used to first break down a prompt into a structured JSON object. This object is then stored in the database and used as reference point for the prompt to DALL-E.

### Image context

The image context object is created by instructing GPT to analyse an input prompt and respond in JSON in the given format.

```js
    // supabase/functions/generate-next-image/index.ts

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
```

### Image prompt

The new context object is then merged with any existing context and a prompt is created with the values of the context.

```js 
    // supabase/functions/generate-next-image/index.ts

    const mergedImageContext = {
        location: newImageContext.location,
        subjects: [...newImageContext.subjects, ...imageContext.subjects],
        actions: [...newImageContext.actions, ...imageContext.actions],
        mood: newImageContext.mood,
    };

    const revisedPrompt = `a ${mergedImageContext.mood} scene, in ${mergedImageContext.location} which depicts ${mergedImageContext.subjects}. ${mergedImageContext.actions} is happening in the scene.`;

    const image = await openai.images.generate({
        prompt: revisedPrompt,
        model: "dall-e-3",
        n: 1,
        size: "1024x1024",
        response_format: "b64_json",
    });
```

