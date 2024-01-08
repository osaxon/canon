import { supabase } from "../lib/supabase";
import { decode } from "base64-arraybuffer";
import { GenerateImageResponse, StoreImageProps } from "../types/functions";

type GenerateImageParams = {
    prompt?: string;
};

export const storeImage = async ({
    base64,
    fileName,
    bucketName,
}: StoreImageProps) => {
    console.log("storing image to supabse bucket");
    const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, decode(`${base64}`), {
            contentType: "image/jpeg",
        })
        .catch(() => {
            throw new Error("failed to upload");
        });
    if (error) {
        console.error(error);
        throw error;
    }

    return data;
};

export const generateImage = async (): Promise<GenerateImageResponse> => {
    const { data, error } = await supabase.functions.invoke("generate-image", {
        body: {},
    });

    if (!data) {
        throw new Error("error generating image");
    }
    console.log(data, "<--- generateImage function response");

    return data;
};
