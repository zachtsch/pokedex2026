import { useLocalSearchParams, Link } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";

export default function AboutComponent() {
  const { id } = useLocalSearchParams();

  // Hold both pokemon stats and species data
  const [data, setData] = useState<any>({ pokemon: null, species: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Fetch BOTH required URLs simultaneously
        const [pokemonRes, speciesRes] = await Promise.all([
          fetch(`https://pokeapi.co/api/v2/pokemon/${id}`),
          fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`),
        ]);

        const pokemonData = await pokemonRes.json();
        const speciesData = await speciesRes.json();

        setData({ pokemon: pokemonData, species: speciesData });
      } catch (error) {
        console.error("Error fetching Pokémon:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FFCB05" />
        <Text>Loading Pokémon data...</Text>
      </View>
    );
  }

  if (!data.pokemon || !data.species) {
    return (
      <View style={styles.centered}>
        <Text>Failed to load Pokémon data.</Text>
      </View>
    );
  }

  const { pokemon, species } = data;

  // Find the first English description and clean up weird line breaks
  const aboutText = species.flavor_text_entries
    .find((entry: any) => entry.language.name === "en")
    ?.flavor_text.replace(/[\f\n\r]/gm, " ");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>{pokemon.name.toUpperCase()}</Text>

      {/* Upgraded to official artwork for a better look */}
      <Image
        source={{
          uri: pokemon.sprites.other["official-artwork"].front_default,
        }}
        style={styles.sprite}
      />

      <Text style={styles.text}>
        ID: <Text style={styles.idText}>{pokemon.id}</Text>
      </Text>

      {/* Added Missing Stats */}
      <Text style={styles.text}>Height: {pokemon.height / 10}m</Text>
      <Text style={styles.text}>Weight: {pokemon.weight / 10}kg</Text>

      <Text style={styles.text}>
        Type: {pokemon.types.map((t: any) => t.type.name).join(", ")}
      </Text>

      {/* Added Missing About Text */}
      <Text style={styles.aboutHeader}>About</Text>
      <Text style={styles.aboutText}>{aboutText}</Text>

      <Link href={`/Evolution/${id}`} style={styles.linkButton}>
        <Text style={styles.linkText}>View Evolution Chain</Text>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flexGrow: 1, alignItems: "center", padding: 20 },
  header: { fontSize: 28, fontWeight: "bold", marginBottom: 10 },
  sprite: { width: 200, height: 200, marginBottom: 10 },
  text: { fontSize: 16, marginBottom: 5, textTransform: "capitalize" },
  idText: { color: "blue", fontWeight: "bold" },
  aboutHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
  },
  aboutText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  linkButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
  },
  linkText: { color: "blue", fontWeight: "bold" },
});
