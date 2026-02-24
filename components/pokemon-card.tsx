import { Image } from "expo-image";
import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export interface PokemonCardProps {
  id: number;
  name: string;
}

// Get Pokémon sprite URL - using PokeAPI's official sprites
const getPokemonImageUrl = (id: number): string => {
  // Using the official Pokémon API image format
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
};

export function PokemonCard({ id, name }: PokemonCardProps) {
  // Capitalize first letter of Pokemon name
  const displayName = name.charAt(0).toUpperCase() + name.slice(1);

  return (
    <Link href={`/about/${id}`} asChild>
      <ThemedView style={styles.card}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: getPokemonImageUrl(id) }}
            style={styles.image}
            contentFit="contain"
            transition={200}
          />
        </View>
        <ThemedText style={styles.name}>{displayName}</ThemedText>
        <ThemedText style={styles.id}>
          #{String(id).padStart(3, "0")}
        </ThemedText>
      </ThemedView>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 4,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 140,
    // Adding a subtle shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  id: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
  },
});
