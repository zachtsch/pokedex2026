// Evolution

// Create a directory inside of app, but not inside (tabs). 
// The name of your directory determines the URL that other teams will link to. 
// In your new directory create a file like: [id].tsx

// Yes your file name will have square brackets in it.

// In the [id].tsx file, export a default component that at the very least calls:

// useLocalSearchParams

// and displays the id that is passed in (maybe in a text component). 
// You may tweak apps/(tabs)/explore.tsx to link to your component for testing purposes. 
// Use a <Link> component. I recommend not pushing the changes to explore.tsx to the remote repo.

import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function Evolution() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Evolution Page</Text>
      <Text style={styles.text}>Pokemon ID: {id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 20,
    marginTop: 10,
  },
});
