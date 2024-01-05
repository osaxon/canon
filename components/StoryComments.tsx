import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, TouchableOpacity, View } from 'react-native';
import { StackParams } from '../App';

type Props = NativeStackScreenProps<StackParams, "StoryComments">

const StoryComments: React.FC<Props> =  ({route, navigation}) => {
    const {story_id} = route.params
    return (
        <>
        <Text>Comments for Story ID: {story_id}</Text>
        </>
    )
}

export default StoryComments;