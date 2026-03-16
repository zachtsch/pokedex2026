import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { SelectPokemon } from "@/components/select-pokemon";

interface TypePokemon {
  id: number;
  name: string;
}

export default function TypeDetailsScreen() {
  const { type } = useLocalSearchParams();
  const selectedType = Array.isArray(type) ? type[0] : type;

  const [pokemonList, setPokemonList] = useState<TypePokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedType) {
      setPokemonList([]);
      setLoading(false);
      setError("No type selected.");
      return;
    }

    let cancelled = false;

    async function loadTypePokemon() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `https://pokeapi.co/api/v2/type/${selectedType.toLowerCase()}`
        );

        if (!response.ok) {
          throw new Error("Failed to load Pokemon for this type.");
        }

        const data = await response.json();
        const pokemon = data.pokemon
          .map((entry: { pokemon: { name: string; url: string } }) => {
            const id = Number(
              entry.pokemon.url.split("/").filter(Boolean).pop()
            );

            return {
              id,
              name: entry.pokemon.name,
            };
          })
          .filter((entry: TypePokemon) => Number.isFinite(entry.id))
          .sort((a: TypePokemon, b: TypePokemon) => a.id - b.id);

        if (!cancelled) {
          setPokemonList(pokemon);
        }
      } catch (fetchError) {
        if (!cancelled) {
          console.error(fetchError);
          setPokemonList([]);
          setError("Could not load Pokemon for this type.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadTypePokemon();

    return () => {
      cancelled = true;
    };
  }, [selectedType]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{selectedType} Type</Text>
      <Text style={styles.subtitle}>
        {loading ? "Loading..." : `${pokemonList.length} Pokemon found`}
      </Text>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      ) : error ? (
        <View style={styles.centerContent}>
          <Text style={styles.message}>{error}</Text>
        </View>
      ) : (
        <SelectPokemon pokemonObjects={pokemonList} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingTop: 24,
    paddingHorizontal: 12,
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "capitalize",
  },
  subtitle: {
    color: "#cfcfcf",
    fontSize: 14,
    marginTop: 6,
    marginBottom: 16,
    textAlign: "center",
    textTransform: "capitalize",
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});
