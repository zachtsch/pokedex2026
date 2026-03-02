//Should now work on all devices
//few design/feature changes to make a better UI experience 
import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, TextInput, Platform, KeyboardAvoidingView,ScrollView} from 'react-native';
import { Link } from 'expo-router';

export default function GuessThatPokemon() {
  const [guess, setGuess] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);
  
  const pokemonName = "pikachu";
  const pokemonId = 25;
  const pokemonImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

  const correct = hasSubmitted && guess.trim().toLowerCase() === pokemonName;
  const showReveal = correct || gaveUp;

  const handleSubmit = () => {
    if (guess.trim() !== "") {
      setHasSubmitted(true);
    }
  };

  const handleReset = () => {
    setGuess("");
    setHasSubmitted(false);
    setGaveUp(false);
  };

  return (
    // KeyboardAvoidingView prevents the keyboard from covering the input on mobile
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Image Section */}
        <View style={styles.imageContainer}>
          {showReveal ? (
            <Link href={`/about/${pokemonId}`} asChild>
              <TouchableOpacity activeOpacity={0.8}>
                <Image
                  source={{ uri: pokemonImageUrl }}
                  style={styles.image}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </Link>
          ) : (
            <Image
              source={{ uri: pokemonImageUrl }}
              // Combines standard tintColor with Web-specific filters
              style={[styles.image, styles.silhouette]}
              resizeMode="contain"
            />
          )}

          {/* Incorrect Guess Popup */}
          {hasSubmitted && !correct && !showReveal && (
            <View style={styles.popup}>
              <Text style={styles.popupText}>That's not me!</Text>
            </View>
          )}
        </View>

        {/* Interaction Section */}
        <TextInput
          style={styles.input}
          placeholder="Type your guess..."
          value={guess}
          onChangeText={text => {
            setGuess(text);
            setHasSubmitted(false);
          }}
          editable={!showReveal}
          autoCapitalize="none"
          onSubmitEditing={handleSubmit} // Allows 'Enter' key submission
          blurOnSubmit={false}
        />

        {!showReveal ? (
          <>
            <TouchableOpacity
              style={[styles.button, { opacity: guess.trim() === "" ? 0.5 : 1 }]}
              onPress={handleSubmit}
              activeOpacity={0.7}
              disabled={guess.trim() === ""}
            >
              <Text style={styles.buttonText}>Submit Guess</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#e74c3c', marginTop: 10 }]}
              onPress={() => setGaveUp(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Give Up</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.resultContainer}>
            <Text style={[styles.statusText, { color: correct ? '#2ecc71' : '#3498db' }]}>
              {correct ? "Correct! Tap image to learn more." : `The answer was ${pokemonName}!`}
            </Text>
            
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#2980b9', marginTop: 10 }]}
              onPress={handleReset}
              activeOpacity={0.7}
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 40,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 250,
    height: 250,
  },
  silhouette: {
    tintColor: 'black',
    // Logic for Web compatibility
    ...Platform.select({
      web: {
        filter: 'brightness(0)',
      },
    }),
  },
  input: {
    width: 250,
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 18,
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2ecc71',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: 250,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        cursor: 'pointer',
      }
    }),
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  popup: {
    position: 'absolute',
    backgroundColor: 'rgba(52, 73, 94, 0.9)',
    padding: 12,
    borderRadius: 12,
    bottom: -10, // Positioned relative to image container
    zIndex: 100,
  },
  popupText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resultContainer: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
