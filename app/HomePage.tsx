import { Text, TouchableOpacity, View } from 'react-native';
import { StackParams } from '../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import {useNavigation} from '@react-navigation/core'

export default function HomePage() {
  const navigation = useNavigation<NativeStackNavigationProp<StackParams>>()
  return (
    <>
        <Text>Home page</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile', {user_id: 1})}>
          <Text>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Stories')}>
          <Text>Stories</Text>
        </TouchableOpacity>
    </>
  );
}
