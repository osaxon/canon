import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { Button } from "@rneui/themed";
import StoryCard from "../components/StoryCard";
import { useHomeFeed, useRefreshOnFocus } from "../utils/hooks";
import ScreenBackground from "../components/ScreenBackground";

export default function Stories() {
    //   const { data: stories, refetch } = useGetStories();
    //   console.log(stories);

    const {
        data: stories,
        refetch,
        isFetchingNextPage,
        fetchNextPage,
        status,
        error,
    } = useHomeFeed();
    useRefreshOnFocus(refetch);

    console.log(JSON.stringify(stories?.pages, null, 2), "<--- the pages");
    if (status === "error") console.error(error);

    const flattenData = stories?.pages
        ? stories?.pages?.flatMap((storyPage) => [...storyPage])
        : [];

    return (
        <ScreenBackground>
            {stories ? (
                <FlatList
                    data={flattenData}
                    renderItem={({ item: story }) => {
                        return (
                            <StoryCard
                                username={story.profiles?.username!}
                                avatar_url={story.profiles?.avatar_url!}
                                {...story}
                            />
                        );
                    }}
                    ListFooterComponent={
                        <>
                            <Button
                                loading={isFetchingNextPage}
                                onPress={() => fetchNextPage()}
                                title="Load More"
                            />
                        </>
                    }
                />
            ) : null}
        </ScreenBackground>
    );
}
