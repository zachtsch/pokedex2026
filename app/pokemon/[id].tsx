import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getPokemonData } from "@/hooks/use-pokemon-cache";
import { useEffect, useState } from "react";

// Get Pokémon sprite URL
const getPokemonImageUrl = (id: number): string => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
};

// Get Pokemon GIF URL (animated)
const getPokemonGifUrl = (id: number): string => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;
};

interface PokemonData {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    versions: {
      "generation-v": {
        "black-white": {
          animated: {
            front_default: string;
          };
        };
      };
    };
  };
  types: {
    type: {
      name: string;
    };
  }[];
  height: number;
  weight: number;
  abilities: {
    ability: {
      name: string;
    };
    is_hidden: boolean;
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
}

export default function PokemonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPokemon() {
      if (!id) return;

      const pokemonId = parseInt(id, 10);
      const data = await getPokemonData(pokemonId);
      setPokemon(data as unknown as PokemonData);
      setLoading(false);
    }

    loadPokemon();
  }, [id]);

  if (loading || !pokemon) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  const displayName =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  const imageUrl = getPokemonImageUrl(pokemon.id);
  const gifUrl = getPokemonGifUrl(pokemon.id);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            contentFit="contain"
            transition={200}
          />
        </View>
        <ThemedText type="title" style={styles.name}>
          {displayName}
        </ThemedText>
        <ThemedText style={styles.id}>
          #{String(pokemon.id).padStart(3, "0")}
        </ThemedText>

        {/* Types */}
        <View style={styles.typesContainer}>
          {pokemon.types.map((type) => (
            <View key={type.type.name} style={styles.typeBadge}>
              <ThemedText style={styles.typeText}>{type.type.name}</ThemedText>
            </View>
          ))}
        </View>
      </View>

      <ThemedView style={styles.infoContainer}>
        {/* Physical Info */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <ThemedText type="subtitle">Height</ThemedText>
            <ThemedText>{pokemon.height / 10} m</ThemedText>
          </View>
          <View style={styles.infoItem}>
            <ThemedText type="subtitle">Weight</ThemedText>
            <ThemedText>{pokemon.weight / 10} kg</ThemedText>
          </View>
        </View>

        {/* Abilities */}
        <View style={styles.section}>
          <ThemedText type="subtitle">Abilities</ThemedText>
          <View style={styles.abilitiesContainer}>
            {pokemon.abilities.map((ability) => (
              <View
                key={ability.ability.name}
                style={[
                  styles.abilityBadge,
                  ability.is_hidden && styles.hiddenAbility,
                ]}
              >
                <ThemedText style={styles.abilityText}>
                  {ability.ability.name.replace("-", " ")}
                  {ability.is_hidden && " (Hidden)"}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* Base Stats */}
        <View style={styles.section}>
          <ThemedText type="subtitle">Base Stats</ThemedText>
          {pokemon.stats.map((stat) => (
            <View key={stat.stat.name} style={styles.statRow}>
              <ThemedText style={styles.statName}>
                {stat.stat.name.replace("-", " ")}
              </ThemedText>
              <ThemedText style={styles.statValue}>{stat.base_stat}</ThemedText>
              <View style={styles.statBarContainer}>
                <View
                  style={[
                    styles.statBar,
                    {
                      width: `${Math.min((stat.base_stat / 255) * 100, 100)}%`,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  imageContainer: {
    width: 150,
    height: 150,
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  id: {
    fontSize: 18,
    opacity: 0.7,
    marginBottom: 12,
  },
  typesContainer: {
    flexDirection: "row",
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  typeText: {
    fontSize: 14,
    textTransform: "capitalize",
  },
  infoContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  infoItem: {
    alignItems: "center",
  },
  section: {
    marginBottom: 20,
  },
  abilitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  abilityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.08)",
  },
  hiddenAbility: {
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  abilityText: {
    fontSize: 14,
    textTransform: "capitalize",
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  statName: {
    width: 100,
    fontSize: 12,
    textTransform: "capitalize",
  },
  statValue: {
    width: 40,
    fontSize: 12,
    fontWeight: "600",
  },
  statBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 4,
    overflow: "hidden",
  },
  statBar: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 4,
  },
});
