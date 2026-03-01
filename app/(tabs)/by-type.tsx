import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Link } from "expo-router";

const types = [
  "normal",
  "fire",
  "water",
  "grass",
  "electric",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

export default function ByTypeTab() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Pokemon By Type</Text>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {types.map((type) => (
          <Link
            key={type}
            href={{
              pathname: "/type/[type]",
              params: { type },
            }}
            asChild
          >
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>{type.toLowerCase()}</Text>
            </Pressable>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "black",
    padding: 20,
  },
  title: {
    color: "white",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    margin: 6,
    width: "45%",
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontSize: 14,
    fontWeight: "bold",
  },
});
