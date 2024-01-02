import { Text, View } from 'react-native';
import { Link, useRouter } from 'expo-router';

export default function HomePage() {

  const router = useRouter();
  router.push("/about")

  return (
    <>
        <Text>Home page</Text>
        <View>
          <Link href="/EmailForm">Form</Link>
        </View>
        <Link href="/about">about</Link>
        <Text>Hi!</Text>
    </>
  );
}
