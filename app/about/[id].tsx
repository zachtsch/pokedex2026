import { useLocalSearchParams, Link } from "expo-router";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";

export default function AboutComponent() {
  const { id } = useLocalSearchParams();
  
  //  API state
  const [pokemon, setPokemon] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  //  Fetch Pokémon data
  useEffect(() => {
    async function fetchPokemon() {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await response.json();
        setPokemon(data);
      } catch (error) {
        console.error("Error fetching Pokémon:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPokemon();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FFCB05" />
        <Text>Loading Pokémon data...</Text>
      </View>
    );
  }

  if (!pokemon) {
    return (
      <View style={styles.container}>
        <Text>Failed to load Pokémon data.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{pokemon.name.toUpperCase()}</Text>

      {/* Display sprite */}
      <Image source={{ uri: pokemon.sprites.front_default }} style={styles.sprite} />

      <Text style={styles.text}>
        Viewing details for Pokémon ID: <Text style={styles.idText}>{pokemon.id}</Text>
      </Text>

      <Text style={styles.text}>
        Type: {pokemon.types.map((t: any) => t.type.name).join(", ")}
      </Text>

      {/* Existing evolution link */}
      <Link href={`/evolution/${id}`} style={styles.linkButton}>
        <Text style={styles.linkText}>View Evolution Chain</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  sprite: { width: 120, height: 120, marginBottom: 10 },
  text: { fontSize: 18, marginBottom: 5 },
  idText: { color: "blue", fontWeight: "bold" },
  linkButton: {},
  linkText: {},
});