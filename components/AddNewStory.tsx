import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, TouchableOpacity, View } from 'react-native';
import { StoriesStackParams } from '../App';
import React from 'react'

type Props = NativeStackScreenProps<StoriesStackParams, "AddNewStory">

const AddNewStory: React.FC<Props> =  ({route, navigation}) => {
    const {story_id} = route.params
    return (
        <>
        <Text>Story ID: {story_id}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('NewStoryConfirm', {story_id})}>
          <Text>Generate</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Stories')}>
          <Text>Cancel</Text>
        </TouchableOpacity>
        </>
    )
}

export default AddNewStory;