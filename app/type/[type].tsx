import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function TypeDetailsScreen() {
  const { type } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selected Type:</Text>
      <Text style={styles.typeText}>{type}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 20,
    marginBottom: 10,
  },
  typeText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  }
});