import React from "react";
import {Image, Button, StyleSheet} from "react-native";
import { ThemedView } from "@/components/themed-view";

const pokemonImageUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png';

export default function Pokemon() {
    return (
        <ThemedView style={styles.container}>
            <Image source={{uri: pokemonImageUrl}} style={styles.image} />

            <Button title="Get Random Pokemon" onPress={() => {}}></Button>
        </ThemedView>
    )
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
});