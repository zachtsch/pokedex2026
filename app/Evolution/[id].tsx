import { useLocalSearchParams, Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";

type EvolutionNode = {
  species: {
    name: string;
    url: string;
  };
  evolves_to: EvolutionNode[];
};

export default function EvolutionPage() {
  const { id } = useLocalSearchParams(); // string id from route
  const pokemonId = id; // keep as string

  const [evolutionChain, setEvolutionChain] = useState<EvolutionNode | null>(null);
  const [currentPokemon, setCurrentPokemon] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pokemonId) return;

    // Reset state when id changes
    setLoading(true);
    setCurrentPokemon(null);
    setEvolutionChain(null);

    const fetchData = async () => {
      try {
        // 1️⃣ Fetch Pokemon by ID
        const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const pokemonData = await pokemonRes.json();
        setCurrentPokemon(pokemonData);

        // 2️⃣ Fetch species data
        const speciesRes = await fetch(pokemonData.species.url);
        const speciesData = await speciesRes.json();

        // 3️⃣ Fetch evolution chain
        const evoRes = await fetch(speciesData.evolution_chain.url);
        const evoData = await evoRes.json();

        setEvolutionChain(evoData.chain);
      } catch (err) {
        console.error("Error fetching evolution data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]); // ⚡ rerun effect whenever route id changes

  function parseEvolutionChain(chain: EvolutionNode): string[] {
    const evolutions: string[] = [];
    let current: EvolutionNode | undefined = chain;

    while (current) {
      evolutions.push(current.species.name);
      current = current.evolves_to[0];
    }

    return evolutions;
  }

  if (loading || !evolutionChain || !currentPokemon) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const evolutions = parseEvolutionChain(evolutionChain);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Evolution Chain</Text>

      <View style={styles.chainContainer}>
        {evolutions.map((name, index) => {
          const isCurrent = name === currentPokemon.name;

          return (
            <View key={name} style={styles.evolutionItem}>
              {/* Navigate to Pokémon's About page */}
              <Link href={`/about/${name}`} asChild>
                <Pressable>
                  <Image
                    source={{
                      uri: `https://img.pokemondb.net/artwork/${name}.jpg`,
                    }}
                    style={[
                      styles.image,
                      isCurrent && styles.highlightedImage,
                    ]}
                  />
                  <Text
                    style={[
                      styles.name,
                      isCurrent && styles.highlightedText,
                    ]}
                  >
                    {name.toUpperCase()}
                  </Text>
                </Pressable>
              </Link>

              {index < evolutions.length - 1 && (
                <Text style={styles.arrow}>⬇️</Text>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  chainContainer: {
    alignItems: "center",
  },
  evolutionItem: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  highlightedImage: {
    borderWidth: 4,
    borderColor: "gold",
  },
  name: {
    marginTop: 8,
    fontSize: 16,
  },
  highlightedText: {
    fontWeight: "bold",
    color: "gold",
  },
  arrow: {
    fontSize: 28,
    marginVertical: 10,
  },
});