import { Image } from 'expo-image';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

import { SelectPokemon } from "@/components/select-pokemon";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function TabTwoScreen() {

  const backgroundColor = useThemeColor({}, "background");

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
            placeholder='Type Something...'>
          </TextInput>
          <Pressable style={styles.searchBtn}>
            <ThemedText style={styles.searchBtnText}>Search</ThemedText>
          </Pressable>
        </ThemedView>
        <SelectPokemon count={1000} />
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
