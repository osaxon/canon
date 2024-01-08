import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, TouchableOpacity, View } from 'react-native';
import { StackParams } from '../App';
import ProfileButton from '../components/ProfileButton';

type Props = NativeStackScreenProps<StackParams, "UserProfile">

const UserProfile: React.FC<Props> =  ({route, navigation}) => {
    const {user_id} = route.params
    return (
        <>
        <Text>User ID: {user_id}</Text>
        </>
    )
}

export default UserProfile;