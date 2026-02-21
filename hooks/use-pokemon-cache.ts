import AsyncStorage from "@react-native-async-storage/async-storage";

const POKEMON_CACHE_PREFIX = "pokemon_cache_";
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export interface CachedPokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  types: {
    type: {
      name: string;
    };
  }[];
}

/**
 * Get cached Pokemon data or fetch from API
 */
export async function getPokemonData(
  id: number
): Promise<CachedPokemon | null> {
  const cacheKey = `${POKEMON_CACHE_PREFIX}${id}`;

  try {
    // Check cache first
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      // Check if cache is still valid
      if (Date.now() - timestamp < CACHE_TTL) {
        return data;
      }
    }

    // Fetch from API if not in cache or expired
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon ${id}`);
    }

    const data = await response.json();

    // Store in cache with timestamp
    await AsyncStorage.setItem(
      cacheKey,
      JSON.stringify({ data, timestamp: Date.now() })
    );

    return data;
  } catch (error) {
    console.error(`Error fetching Pokemon ${id}:`, error);
    return null;
  }
}

/**
 * Pre-cache a list of Pokemon IDs
 * This helps avoid rate limiting by caching in advance
 */
export async function preCachePokemon(ids: number[]): Promise<void> {
  // Process in batches to avoid overwhelming the API
  const batchSize = 10;
  const delay = 100; // 100ms delay between requests to be respectful

  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (id) => {
        await getPokemonData(id);
      })
    );
    // Add delay between batches
    if (i + batchSize < ids.length) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

/**
 * Clear all Pokemon cache
 */
export async function clearPokemonCache(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const pokemonKeys = keys.filter((key) =>
      key.startsWith(POKEMON_CACHE_PREFIX)
    );
    await AsyncStorage.multiRemove(pokemonKeys);
  } catch (error) {
    console.error("Error clearing Pokemon cache:", error);
  }
}
