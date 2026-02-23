import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';

export default function ByTypeTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pokemon By Type</Text>
      
      <Link 
        href={{
          pathname: "/type/[type]",
          params: { type: "water" }
        }}
        asChild
      >
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Test Water Type</Text>
        </Pressable>
      </Link>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  }
});