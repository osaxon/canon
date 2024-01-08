export type StoreImageProps = {
    base64: string;
    bucketName: string;
    fileName: string;
};

export type GenerateImageResponse = {
    created: number;
    data: Array<{ revised_prompt: string; url?: string; base64?: string }>; // TODO will need to update with base64 as return type
};
