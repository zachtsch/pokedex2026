import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { Link } from "expo-router";

export default function GuessThatPokemon() {
  const [guess, setGuess] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);

  const [pokemonId, setPokemonId] = useState<number | null>(null);
  const [pokemonName, setPokemonName] = useState<string>("");

  const getRandomPokemon = async () => {
    const randomId = Math.floor(Math.random() * 898) + 1;
    setPokemonId(randomId);

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      const data = await res.json();
      setPokemonName(data.name.toLowerCase());
    } catch (err) {
      console.error("Error fetching Pokémon:", err);
    }

    setGuess("");
    setHasSubmitted(false);
    setGaveUp(false);
  };

  useEffect(() => {
    getRandomPokemon();
  }, []);

  const correct = hasSubmitted && guess.trim().toLowerCase() === pokemonName;
  const showReveal = correct || gaveUp;

  const handleSubmit = () => {
    if (guess.trim() !== "") {
      setHasSubmitted(true);
    }
  };

  const handleReset = () => {
    getRandomPokemon();
  };

  const pokemonImageUrl = pokemonId
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`
    : null;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.imageContainer}>
          {pokemonImageUrl && showReveal ? (
            <Link href={`/about/${pokemonId}`} asChild>
              <TouchableOpacity activeOpacity={0.8}>
                <Image
                  source={{ uri: pokemonImageUrl }}
                  style={styles.image}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </Link>
          ) : pokemonImageUrl ? (
            <Image
              source={{ uri: pokemonImageUrl }}
              style={[styles.image, styles.silhouette]}
              resizeMode="contain"
            />
          ) : (
            <Text>Loading...</Text>
          )}

          {hasSubmitted && !correct && !showReveal && (
            <View style={styles.popup}>
              <Text style={styles.popupText}>That is not me!</Text>
            </View>
          )}
        </View>

        {/* HIDE INPUT WHEN GAVE UP */}
        {!gaveUp && (
          <TextInput
            style={styles.input}
            placeholder="Type your guess..."
            value={guess}
            onChangeText={(text) => {
              setGuess(text);
              setHasSubmitted(false);
            }}
            editable={!showReveal}
            autoCapitalize="none"
            onSubmitEditing={handleSubmit}
          />
        )}

        {!showReveal ? (
          <>
            <TouchableOpacity
              style={[
                styles.button,
                { opacity: guess.trim() === "" ? 0.5 : 1 },
              ]}
              onPress={handleSubmit}
              disabled={guess.trim() === ""}
            >
              <Text style={styles.buttonText}>Submit Guess</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: "#e74c3c", marginTop: 10 },
              ]}
              onPress={() => setGaveUp(true)}
            >
              <Text style={styles.buttonText}>Give Up</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.resultContainer}>
            <Text
              style={[
                styles.statusText,
                { color: correct ? "#2ecc71" : "#3498db" },
              ]}
            >
              {correct
                ? "Correct! Tap image to learn more."
                : `The answer was ${pokemonName}!`}
            </Text>

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: "#2980b9", marginTop: 10 },
              ]}
              onPress={handleReset}
            >
              <Text style={styles.buttonText}>Play Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f5ed",
    paddingVertical: 40,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 250,
    height: 250,
  },
  silhouette: {
    tintColor: "black",
    ...Platform.select({
      web: { filter: "brightness(0)" },
    }),
  },
  input: {
    width: 240,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 19,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 18,
    backgroundColor: "#f9f9f9",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#2ecc71",
    paddingVertical: 14,
    borderRadius: 30,
    width: 250,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  popup: {
    position: "absolute",
    backgroundColor: "rgba(52, 73, 94, 0.9)",
    padding: 12,
    borderRadius: 12,
    bottom: -10,
    zIndex: 100,
  },
  popupText: {
    color: "#fff",
    fontWeight: "bold",
  },
  resultContainer: {
    alignItems: "center",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    paddingHorizontal: 25,
  },
});
