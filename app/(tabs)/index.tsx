import { StyleSheet, View } from "react-native";

import { SelectPokemon } from "@/components/select-pokemon";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Pokédex</ThemedText>
        <ThemedText style={styles.subtitle}>
          Select a Pokémon to learn more!
        </ThemedText>
      </View>
      <SelectPokemon count={1000} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
});
