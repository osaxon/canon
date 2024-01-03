import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, TouchableOpacity, View } from 'react-native';
import { StackParams } from '../App';

type Props = NativeStackScreenProps<StackParams, "StoryAdd">

const StoryAdd: React.FC<Props> =  ({route, navigation}) => {
    const {story_id} = route.params
    return (
        <>
        <Text>Story ID: {story_id}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('StoryConfirm', {story_id})}>
          <Text>Generate</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Stories')}>
          <Text>Cancel</Text>
        </TouchableOpacity>
        </>
    )
}

export default StoryAdd;