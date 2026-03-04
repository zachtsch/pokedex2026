import { useState, useEffect, useRef } from "react";
import { TextInput, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SelectPokemon } from "@/components/select-pokemon";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";

import { getPokemonData } from "@/hooks/use-pokemon-cache";

export default function TabTwoScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const [userInput, setUserInput] = useState("");
  const [displayCards, setDisplayCards] = useState<number[]>([]);
  const [nameMap, setNameMap] = useState<Record<number, string>>({});
  const inputRef = useRef<TextInput>(null);

  // Build name map once on mount
  useEffect(() => {
    (async () => {
      const res = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0"
      );
      const json = await res.json();

      const map: Record<number, string> = {};

      for (const p of json.results as { name: string; url: string }[]) {
        const parts = p.url.split("/").filter(Boolean);
        const id = Number(parts[parts.length - 1]); // last part is the id

        if (!Number.isNaN(id)) {
          map[id] = p.name.toLowerCase();
        }
      }

      setNameMap(map);
    })();
  }, []);

  // Filter whenever user types
  useEffect(() => {
    const q = userInput.trim().toLowerCase();
    if (!q) {
      setDisplayCards([]);
      return;
    }

    const newCards: number[] = [];
    for (let id = 1; id < 1000; id++) {
      if (nameMap[id] && nameMap[id].includes(q)) {
        newCards.push(id);
      }
    }
    setDisplayCards(newCards);
  }, [userInput, nameMap]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }} edges={["top"]}>
      <ThemedView style={styles.parentContainer}>
        <ThemedText style={styles.header}>Search For Your Pokemon</ThemedText>
        <ThemedView style={styles.searchBar}>
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            value={userInput}
            onChangeText={(text) => setUserInput(text)}
            placeholder="Search..."
            placeholderTextColor="gray"
            autoCorrect={false}
            autoCapitalize="none"
            spellCheck={false}
          />
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
    fontWeight: "bold",
  },
  searchBar: {
    flexDirection: "row",
    padding: 10,
  },
  searchInput: {
    color: "black",
    flex: 1,
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    borderRadius: 12,
    marginRight: 8,
  },
  searchBtn: {
    justifyContent: "center",
    alignContent: "center",
    borderWidth: 1,
    borderColor: "green",
    padding: 10,
    borderRadius: 12,
  },
  searchBtnText: {
    color: "green",
  },
});
