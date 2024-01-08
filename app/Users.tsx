import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, TouchableOpacity, View } from 'react-native';
import { UsersStackParams } from '../App';

type Props = NativeStackScreenProps<UsersStackParams, "Users">

const Users: React.FC<Props> =  ({route, navigation}) => {
    
    return (
        <>
        <TouchableOpacity onPress={() => navigation.navigate('UserProfile', {user_id: 1})}>
          <Text>User 1</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('UserProfile', {user_id: 2})}>
          <Text>User 2</Text>
        </TouchableOpacity>
        </>
    )
}

export default Users;