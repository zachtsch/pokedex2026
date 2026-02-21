import { FlashList } from "@shopify/flash-list";
import { useCallback, useEffect, useState } from "react";

import { PokemonCard, PokemonCardProps } from "@/components/pokemon-card";
import { getPokemonData, preCachePokemon } from "@/hooks/use-pokemon-cache";

export interface SelectPokemonProps {
  /** Array of Pokemon IDs (e.g., [1, 2, 3, ...]) */
  pokemonIds?: number[];
  /** Array of Pokemon objects with id key (e.g., [{ id: 1, name: "bulbasaur" }, ...]) */
  pokemonObjects?: { id: number; name?: string }[];
  /** Number of Pokemon to display (default: 151 for Gen 1) */
  count?: number;
}

// Pokemon API base URL
const POKEMON_API_LIMIT = 10025; // Total Pokemon as of current

/**
 * SelectPokemon Component - A scrollable list of selectable Pokemon
 *
 * Can be used in multiple ways:
 * - Pass pokemonIds for a list of specific IDs
 * - Pass pokemonObjects for a list of objects with id keys
 * - Pass count to generate IDs 1 to count (default: 151)
 */
export function SelectPokemon({
  pokemonIds,
  pokemonObjects,
  count = 151,
}: SelectPokemonProps) {
  const [pokemonList, setPokemonList] = useState<PokemonCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPokemon() {
      setLoading(true);

      let ids: number[] = [];

      if (pokemonIds) {
        ids = pokemonIds;
      } else if (pokemonObjects) {
        ids = pokemonObjects.map((p) => p.id);
      } else {
        // Default: generate IDs from 1 to count
        ids = Array.from({ length: count }, (_, i) => i + 1);
      }

      // Pre-cache Pokemon data in the background to avoid rate limiting
      preCachePokemon(ids.slice(0, 50)).catch(console.error);

      // For display, we'll use the ID and generate a name
      // The actual data will be fetched when needed or from cache
      const pokemonData: PokemonCardProps[] = await Promise.all(
        ids.map(async (id) => {
          // Try to get cached data for the name
          const cached = await getPokemonData(id);

if (cached?.name) {
  return { id, name: cached.name };
}

try {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await res.json();
  return { id, name: data.name };
} catch {
  return { id, name: `pokemon_${id}` };
}

        })
      );

      setPokemonList(pokemonData);
      setLoading(false);
    }

    loadPokemon();
  }, [pokemonIds, pokemonObjects, count]);

  const renderItem = useCallback(
    ({ item }: { item: PokemonCardProps }) => (
      <PokemonCard id={item.id} name={item.name} />
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: PokemonCardProps) => String(item.id),
    []
  );

  if (loading) {
    return null; // Or could return a loading skeleton
  }

  return (
    <FlashList
      data={pokemonList}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={3}
      estimatedItemSize={150}
      contentContainerStyle={{ padding: 4 }}
      showsVerticalScrollIndicator={false}
    />
  );
}

/**
 * Generate Pokemon name from ID (fallback when API data unavailable)
 * Uses the Pokemon API naming convention
 */
function getPokemonName(id: number): string {
  // This is a simple fallback - in production, you'd want to fetch from API
  // or use a static list of names
  return `pokemon_${id}`;
}
