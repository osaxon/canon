export type StoreImageProps = {
    base64: string;
    filePath: string;
    fileName: string;
};

export type GenerateImageResponse = {
    created: number;
    data: Array<{ revised_prompt: string; url: string }>; // TODO will need to update with base64 as return type
};
