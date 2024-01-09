export enum EdgeFunctions {
    GENERATE_IMAGE = "generate-image",
    NEXT_IMAGE = "generate-next-image",
}

export type StoreImageProps = {
    base64: string;
    bucketName: string;
    fileName: string;
};

export type GenerateImageResponse = {
    image: {
        b64_json?: string;
        revised_prompt: string;
        original_prompt: string;
    };
    imageContext: ImageContext;
};

export type GenerateNextImageParams = {
    prompt: string;
    imageContext: ImageContext;
};

export type ImageContext = {
    location: string;
    subjects: string[];
    actions: string[];
    mood: string;
};

export type NewStoryInputs = {
    userId: string;
    imageData: ImageData;
};

export type ImageData = {
    imageContext: ImageContext | undefined;
    imageUrl: string | undefined;
    prompt: string | undefined;
};
