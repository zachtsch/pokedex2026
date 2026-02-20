import { useLocalSearchParams, Link } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function AboutComponent() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pokémon About Page</Text>
      <Text style={styles.text}>
        Viewing details for Pokémon ID: <Text style={styles.idText}>{id}</Text>
      </Text>

      {/* Link Component */}
      <Link href={`/evolution/${id}`} style={styles.linkButton}>
        <Text style={styles.linkText}>View Evolution Chain</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  text: { fontSize: 18 },
  idText: { color: "blue", fontWeight: "bold" },
  linkButton: {},
  linkText: {},
});
