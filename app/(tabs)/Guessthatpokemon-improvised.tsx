//Improvised GuessthatPokemon 
//Fixed issue empty onPress handler, set isGussed to update (Was previously set to always false)
//Couldn't figure out how to perfectly silhoutte the image on IOS, Andriod and web, one of the other is always messing up. 

import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';

export default function GuessThatPokemon() {
  const [isGuessed, setIsGuessed] = useState(false);
  const pokemonImageUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png';

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: pokemonImageUrl }}
          style={styles.image}
          fadeDuration={0}
        />
        {!isGuessed && (
          <View style={styles.silhouetteOverlay}>
            <Image
              source={{ uri: pokemonImageUrl }}
              style={[styles.image, styles.silhouetteImage]}
              fadeDuration={0}
            />
          </View>
        )}
      </View>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => setIsGuessed(prev => !prev)}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>
          {isGuessed ? "Hide Pokemon" : "Guess Pokemon"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: 200,
    height: 200,
    marginBottom: 30,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  silhouetteOverlay: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: 'black',
  },
  silhouetteImage: {
    tintColor: 'white',
    opacity: 1,
    mixBlendMode: 'screen', // This creates the silhouette effect
  },
  button: {
    backgroundColor: '#2ecc71',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
