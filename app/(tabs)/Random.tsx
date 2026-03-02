import React, {useState, useEffect} from "react";
import {Image, Button, StyleSheet, Text} from "react-native";
import { Link } from "expo-router";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";


export default function Pokemon() {
  const [pokemonId, setPokemonId] = useState<number | null>(null);

  const getRandomPokemon = () => {
    const randomId = Math.floor(Math.random() * 898) + 1; 
    setPokemonId(randomId)
  }

  useEffect(() => {
    getRandomPokemon();
  }, []);


  return (
      <ThemedView style={styles.container}>
          {pokemonId ? (
                <>
                    <ThemedText> A wild Pokémon appears!</ThemedText>
                    <Link href={`/about/${pokemonId}`}>
                        <Image source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png` }} style={styles.image} />
                    </Link>
                    <ThemedText>Tap the Pokémon to learn more!</ThemedText>
                </>
            ) : (
                <ThemedText style={styles.flavorText}>Loading...</ThemedText>
            )}
          <Button title="Get Random Pokemon" onPress={getRandomPokemon}></Button>
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  flavorText: {

  }
});