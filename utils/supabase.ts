import { supabase } from "../lib/supabase";
import { decode } from "base64-arraybuffer";
import { StoreImageProps } from "../types/functions";

export const storeImage = async ({
    base64,
    fileName,
    filePath,
}: StoreImageProps) => {
    const { data, error } = await supabase.storage
        .from(filePath)
        .upload(fileName, decode(`${base64}`), {
            contentType: "image/jpeg",
        });
    if (error) throw error;

    return data;
};
