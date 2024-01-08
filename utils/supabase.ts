import { supabase } from "../lib/supabase";
import { decode } from "base64-arraybuffer";
import {
    GenerateImageResponse,
    StoreImageProps,
    GenerateNextImageParams,
    EdgeFunctions,
} from "../types/functions";

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
    const { data, error } =
        await supabase.functions.invoke<GenerateImageResponse>(
            EdgeFunctions.GENERATE_IMAGE,
            {
                body: {},
            }
        );

    if (!data) {
        throw new Error("error generating image");
    }
    console.log(data, "<--- generateImage function response");

    return data;
};

export const generateNextImage = async (
    params: GenerateNextImageParams
): Promise<GenerateImageResponse> => {
    const { data, error } =
        await supabase.functions.invoke<GenerateImageResponse>(
            EdgeFunctions.NEXT_IMAGE,
            {
                body: {
                    prompt: params.prompt,
                    imageContext: params.imageContext,
                },
            }
        );
    if (!data?.image) {
        throw new Error("error generating image");
    }
    return data;
};
