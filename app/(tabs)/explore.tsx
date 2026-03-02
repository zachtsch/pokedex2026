import { useState, useEffect, useRef } from "react";
import { TextInput, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SelectPokemon } from "@/components/select-pokemon";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";

import { getPokemonData, preCachePokemon } from "@/hooks/use-pokemon-cache";

export default function TabTwoScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const [userInput, setUserInput] = useState('');
  const [displayCards, setDisplayCards] = useState<number[]>([]);

  let pokemon = ['%#$@'] // '%#$@' removes there from being an array zero
  for (let id = 1; id < 1000; id++) {
    getPokemonData(id).then(p => {
      if (p != null) pokemon.push(p.name);
    })
  }

  useEffect(() => {
    setDisplayCards([])
    let newCards: number[] = [];

    if (pokemon == null) return;
    for (let i = 1; i < pokemon.length; i++) {
      if (pokemon[i].includes(userInput.toLowerCase())) {
        newCards.push(i)
      }
    }
    setDisplayCards(newCards)
  }, [userInput]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor }}
      edges={["top"]}
    >
      <ThemedView style={styles.parentContainer}>
        <ThemedText style={styles.header}>Search For Your Pokemon</ThemedText>
        <ThemedView style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            value={userInput}
            onChangeText={(text) => setUserInput(text)}
            placeholder='Type in a Pokemon...'>
          </TextInput>
          <Pressable style={styles.searchBtn}>
            <ThemedText style={styles.searchBtnText}>Search</ThemedText>
          </Pressable>
        </ThemedView>
        <SelectPokemon pokemonIds={displayCards} />
      </ThemedView>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
  },
  header: {
    color: "white",
    fontSize: 30,
    alignSelf: "center",
    padding: 10,
    fontWeight: "bold"
  },
  searchBar: {
    flexDirection: "row",
    padding: 10,
  },
  searchInput: {
    color: "white",
    width: 300,
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    borderRadius: 12,
    marginRight: 8,
  },
  searchBtn: {
    backgroundColor: "",
    justifyContent: 'center',
    alignContent: 'center',
    borderWidth: 1,
    borderColor: "green",
    padding: 10,
    borderRadius: 12,
  },
  searchBtnText: {
    color: "green"
  },
});
