import { supabase } from "../lib/supabase";
import { decode } from "base64-arraybuffer";
import { GenerateImageResponse, StoreImageProps } from "../types/functions";

type GenerateImageParams = {
    body: {
        prompt?: string;
    };
};

export const storeImage = async ({
    base64,
    fileName,
    bucketName,
}: StoreImageProps) => {
    const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, decode(`${base64}`), {
            contentType: "image/jpeg",
        })
        .catch(() => {
            throw new Error("failed to upload");
        });
    if (error) throw error;

    return data;
};

export const generateImage = async (params: GenerateImageParams) => {
    const {
        data: {
            data: [{ revised_prompt, base64, url }],
        },
        error,
    } = (await supabase.functions.invoke("generate-image", {
        body: {},
    })) as {
        data: GenerateImageResponse;
        error: any;
    };
    if (!base64) {
        throw new Error("error generating image");
    }
    return { revised_prompt, base64, url };
};
