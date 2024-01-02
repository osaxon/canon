import { Text, TouchableOpacity, View } from 'react-native';
import { RootStackParams } from '../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import {useNavigation} from '@react-navigation/core'

export default function HomePage() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>()
  return (
    <>
        <Text>Home page</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('About')}>
          <Text>About</Text>
        </TouchableOpacity>
        <Text>Hi!!</Text>
    </>
  );
}
