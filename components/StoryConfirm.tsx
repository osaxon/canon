import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, TouchableOpacity, View } from 'react-native';
import { StoriesStackParams } from '../App';

type Props = NativeStackScreenProps<StoriesStackParams, "StoryConfirm">

const StoryConfirm: React.FC<Props> =  ({route, navigation}) => {
    const {story_id} = route.params
    return (
        <>
        <Text>Story ID: {story_id}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Stories')}>
          <Text>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('StoryAdd', {story_id})}>
          <Text>Re-do</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('FullStory', {story_id})}>
          <Text>Confirm</Text>
        </TouchableOpacity>
        </>
    )
}

export default StoryConfirm;