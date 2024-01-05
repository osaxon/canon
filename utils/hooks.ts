import { supabase } from "../lib/supabase";
import { StoreImageProps } from "../types/functions";
import { storeImage } from "./supabase";
import { useQuery, useMutation } from "@tanstack/react-query";

export const useGetStories = () => {
    return useQuery({
        queryKey: ["stories"],
        queryFn: async () => {
            const { data } = await supabase
                .from("stories")
                .select("*")
                .throwOnError();
            return data || [];
        },
    });
};

export const useGetComments = () => {
    return useQuery({
        queryKey: ["comments"],
        queryFn: async () => {
            const { data } = await supabase
                .from("comments")
                .select("*")
                .throwOnError();
            return data || [];
        },
    });
};

export const useStoreImage = ({
    base64,
    fileName,
    filePath,
}: StoreImageProps) => {
    return useMutation({
        mutationKey: ["store-image", fileName, filePath],
        mutationFn: () => storeImage({ base64, fileName, filePath }),
    });
};
