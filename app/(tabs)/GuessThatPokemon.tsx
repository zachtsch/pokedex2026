import React, { useState } from 'react';
import { View, Image, Button, StyleSheet } from 'react-native';

export default function GuessThatPokemon() {
  const [isGuessed, setIsGuessed] = useState(false);

  // For future, we'll use url from evolution team. [id].tsx
  const pokemonImageUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png';

  
  return (
    <View style={styles.container}>
      <Image
        key={isGuessed ? 'reveal' : 'hide'}
        source={{ uri: pokemonImageUrl }}
        style={[
          styles.image,
          !isGuessed && { tintColor: 'black' }
        ]}
      />

      <Button
        title="Guess Pokemon"
        onPress={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});