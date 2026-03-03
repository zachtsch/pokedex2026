//works on multiple pokemons now
//added a shake effect feature upon guessing pokemon wrong
//added more incorrect guesses pop up texts
//fixed issues of pokemon with hyphens in name appearing as incorrect guess when guessed correctly without hyphens 
import React, { useState, useEffect, useRef } from 'react';
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
  ActivityIndicator,
  Animated
} from 'react-native';
import { Link } from 'expo-router';

export default function GuessThatPokemon() {
  const [guess, setGuess] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);
  const [pokemonName, setPokemonName] = useState("");
  const [pokemonId, setPokemonId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true); // Fix for image flicker
  const [popupMessage, setPopupMessage] = useState("That's not me!");
  
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const incorrectMessages = [
    "That's not me!",
    "Not quite!",
    "Try again!",
    "Almost there!",
    "Close, but no Berry!",
    "Wild Pokémon fled from that guess!"
  ];

  const fetchRandomPokemon = async () => {
    setLoading(true);
    setImageLoading(true);
    // Capping at 1010 to ensure "Official Artwork" exists for all results
    const randomId = Math.floor(Math.random() * 1010) + 1;
    
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      const data = await response.json();
      setPokemonId(data.id);
      // Clean name: e.g., "mr-mime" -> "mr mime"
      setPokemonName(data.name.replace(/-/g, ' ')); 
    } catch (error) {
      console.error("Error fetching Pokémon:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRandomPokemon();
  }, []);

  const startShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const getRandomMessage = () => {
    const otherMessages = incorrectMessages.filter(msg => msg !== popupMessage);
    const randomIndex = Math.floor(Math.random() * otherMessages.length);
    return otherMessages[randomIndex];
  };

  const handleSubmit = () => {
    if (guess.trim() === "") return;

    // Sanitize both for comparison: remove hyphens and extra spaces
    const cleanGuess = guess.trim().toLowerCase().replace(/-/g, ' ');
    const isCorrect = cleanGuess === pokemonName.toLowerCase();
    
    if (!isCorrect) {
      setPopupMessage(getRandomMessage());
      startShake();
    }
    setHasSubmitted(true);
  };

  const handleReset = () => {
    setGuess("");
    setHasSubmitted(false);
    setGaveUp(false);
    setPopupMessage("That's not me!");
    fetchRandomPokemon();
  };

  const correct = hasSubmitted && guess.trim().toLowerCase().replace(/-/g, ' ') === pokemonName.toLowerCase();
  const showReveal = correct || gaveUp;
  const pokemonImageUrl = pokemonId
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`
    : null;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView 
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled" // Fix: allows button clicks while keyboard is up
      >
        <Animated.View 
          style={[
            styles.imageContainer, 
            { transform: [{ translateX: shakeAnimation }] }
          ]}
        >
          {(loading || (imageLoading && !showReveal)) && (
            <ActivityIndicator size="large" color="#2ecc71" style={styles.loader} />
          )}
          
          {pokemonImageUrl && (
            <View style={loading ? { opacity: 0 } : { opacity: 1 }}>
              {showReveal ? (
                <Link href={`/about/${pokemonId}`} asChild>
                  <TouchableOpacity activeOpacity={0.8}>
                    <Image 
                      source={{ uri: pokemonImageUrl }} 
                      style={styles.image} 
                      resizeMode="contain"
                      onLoadEnd={() => setImageLoading(false)}
                    />
                  </TouchableOpacity>
                </Link>
              ) : (
                <Image
                  source={{ uri: pokemonImageUrl }}
                  style={[styles.image, styles.silhouette]}
                  resizeMode="contain"
                  onLoadEnd={() => setImageLoading(false)}
                />
              )}
            </View>
          )}

          {hasSubmitted && !correct && !showReveal && (
            <View style={styles.popup}>
              <Text style={styles.popupText}>{popupMessage}</Text>
            </View>
          )}
        </Animated.View>

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
          autoCorrect={false} // Prevents annoying mobile autocorrects
          onSubmitEditing={handleSubmit}
          blurOnSubmit={false}
        />

        {!showReveal ? (
          <>
            <TouchableOpacity
              style={[styles.button, { opacity: guess.trim() === "" ? 0.5 : 1 }]}
              onPress={handleSubmit}
              disabled={guess.trim() === ""}
            >
              <Text style={styles.buttonText}>Submit Guess</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.giveUpButton]}
              onPress={() => setGaveUp(true)}
            >
              <Text style={styles.buttonText}>Give Up</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.resultContainer}>
            <Text style={[styles.statusText, { color: correct ? "#2ecc71" : "#3498db" }]}>
              {correct ? "Correct! Tap image to learn more." : `The answer was ${pokemonName}!`}
            </Text>
            <TouchableOpacity style={[styles.button, styles.playAgainButton]} onPress={handleReset}>
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
    backgroundColor: "#fff",
    paddingVertical: 40,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 250,
    width: '100%',
  },
  loader: {
    position: 'absolute',
    zIndex: 1,
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
    width: 250,
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 18,
    backgroundColor: "#f9f9f9",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#2ecc71",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: 250,
    alignItems: "center",
    marginTop: 10,
  },
  giveUpButton: { backgroundColor: "#e74c3c" },
  playAgainButton: { backgroundColor: "#2980b9" },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  popup: {
    position: "absolute",
    backgroundColor: "rgba(52, 73, 94, 0.9)",
    padding: 12,
    borderRadius: 12,
    bottom: -10,
    zIndex: 10,
  },
  popupText: { color: "#fff", fontWeight: "bold" },
  resultContainer: { alignItems: "center" },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    paddingHorizontal: 20,
    textTransform: 'capitalize',
  },
});
