export type StoreImageProps = {
    base64: string;
    bucketName: string;
    fileName: string;
};

export type GenerateImageResponse = {
    image: {
        b64_json?: string;
        revised_prompt: string;
    }; // TODO will need to update with base64 as return type
};
