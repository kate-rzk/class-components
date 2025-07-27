import { useState, useEffect, useCallback } from 'react';
import type { ChangeEvent } from 'react';
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import useInput from './hooks/useInput';
import useSearchQuery from './hooks/useSearchQuery';

export interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
  height: number;
  weight: number;
}

interface PokemonListResponse {
  results: PokemonListItem[];
}

interface PokemonListItem {
  name: string;
  url: string;
}

interface PokemonDetailResponse {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  types: PokemonType[];
  height: number;
  weight: number;
}

interface PokemonType {
  type: {
    name: string;
  };
}

interface AppState {
  loading: boolean;
  pokemons: Pokemon[];
  currentPage: number;
  offset: number;
  searchResults: Pokemon[];
  searchLoading: boolean;
  allPokemonNames: PokemonListItem[];
  pokemonCache: Map<string, Pokemon>;
}

const STORAGE_KEYS = {
  SEARCH_QUERY: 'pokemon_search_query',
  SEARCH_RESULTS: 'pokemon_search_results',
  IS_SEARCHING: 'pokemon_is_searching',
  POKEMON_CACHE: 'pokemon_cache',
} as const;

function App(): React.JSX.Element {
  const [state, setState] = useState<AppState>({
    loading: false,
    pokemons: [],
    currentPage: 1,
    offset: 0,
    searchResults: [],
    searchLoading: false,
    allPokemonNames: [],
    pokemonCache: new Map(),
  });

  const POKEMONS_PER_PAGE: number = 20;
  const TOTAL_POKEMON_NUMBERS: number = 1302;

  const saveToStorage = useCallback((key: string, value: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, []);

  const getFromStorage = useCallback((key: string): unknown | null => {
    const item = localStorage.getItem(key);
    if (item === null) return null;
    try {
      return JSON.parse(item);
    } catch (error) {
      console.warn('Error reading from localStorage:', error);
      return item;
    }
  }, []);

  const removeFromStorage = useCallback((key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }, []);
  const savePokemonCache = useCallback(
    (cache: Map<string, Pokemon>) => {
      const cacheArray = Array.from(cache.entries());
      saveToStorage(STORAGE_KEYS.POKEMON_CACHE, cacheArray);
    },
    [saveToStorage]
  );

  const loadPokemonCache = useCallback((): Map<string, Pokemon> => {
    const cacheObj = getFromStorage(STORAGE_KEYS.POKEMON_CACHE);
    return cacheObj ? new Map(Object.entries(cacheObj)) : new Map();
  }, [getFromStorage]);

  const loadAllPokemonNames = useCallback(async () => {
    try {
      const URL = `https://pokeapi.co/api/v2/pokemon?limit=${TOTAL_POKEMON_NUMBERS}`;
      const response = await fetch(URL);
      const data: PokemonListResponse = await response.json();
      setState((prevState) => ({
        ...prevState,
        allPokemonNames: data.results,
      }));
    } catch (error) {
      console.error('Error loading pokemon names:', error);
    }
  }, []);
  useEffect(() => {
    const savedCache = loadPokemonCache();
    setState((prev) => ({ ...prev, pokemonCache: savedCache }));

    const savedSearchQuery = getFromStorage(
      STORAGE_KEYS.SEARCH_QUERY
    ) as string;
    const savedIsSearching = getFromStorage(STORAGE_KEYS.IS_SEARCHING);
    const savedSearchResults = getFromStorage(STORAGE_KEYS.SEARCH_RESULTS);

    if (savedSearchQuery && savedIsSearching) {
      input.onChange({
        target: { value: savedSearchQuery },
      } as ChangeEvent<HTMLInputElement>);

      setSearchQuery(savedSearchQuery);
      setIsSearching(true);

      if (savedSearchResults) {
        setState((prev) => ({
          ...prev,
          savedSearchResults: savedSearchResults,
        }));
      }
    }
  }, [getFromStorage, loadPokemonCache]);
  useEffect(() => {
    const savedSearchQuery = getFromStorage(
      STORAGE_KEYS.SEARCH_QUERY
    ) as string;
    const savedIsSearching = getFromStorage(STORAGE_KEYS.IS_SEARCHING);

    if (
      savedSearchQuery &&
      savedIsSearching &&
      state.allPokemonNames.length > 0
    ) {
      searchPokemon(savedSearchQuery, false);
    }
  }, [state.allPokemonNames, getFromStorage]);
  useEffect(() => {
    loadAllPokemonNames();
  }, []);

  const searchPokemon = useCallback(
    async (query: string, shouldSaveToStorage: boolean = true) => {
      if (!query.trim()) {
        setState((prev) => ({ ...prev, searchResults: [] }));
        if (shouldSaveToStorage) {
          removeFromStorage(STORAGE_KEYS.SEARCH_RESULTS);
        }
        return;
      }

      setState((prev) => ({ ...prev, searchLoading: true }));

      try {
        const matchingNames = state.allPokemonNames.filter((pokemon) =>
          pokemon.name.toLowerCase().includes(query.toLowerCase())
        );

        const limitedMatches = matchingNames.slice(0, 20);

        const pokemonPromises = limitedMatches.map(async (pokemonItem) => {
          const cachedPokemon = state.pokemonCache.get(pokemonItem.name);
          if (cachedPokemon) {
            return cachedPokemon;
          }

          const pokemonResponse = await fetch(pokemonItem.url);
          const pokemonData: PokemonDetailResponse =
            await pokemonResponse.json();

          const pokemon: Pokemon = {
            id: pokemonData.id,
            name: pokemonData.name,
            image: pokemonData.sprites.front_default,
            types: pokemonData.types.map((type: PokemonType) => type.type.name),
            height: pokemonData.height,
            weight: pokemonData.weight,
          };

          setState((prev) => {
            const newCache = new Map(
              prev.pokemonCache.set(pokemon.name, pokemon)
            );
            savePokemonCache(newCache);
            return {
              ...prev,
              pokemonCache: newCache,
            };
          });

          return pokemon;
        });

        const searchResults = await Promise.all(pokemonPromises);

        setState((prev) => ({
          ...prev,
          searchResults,
          searchLoading: false,
        }));

        if (shouldSaveToStorage) {
          saveToStorage(STORAGE_KEYS.SEARCH_RESULTS, searchResults);
        }
      } catch (error) {
        console.error('Search error:', error);
        setState((prev) => ({
          ...prev,
          searchResults: [],
          searchLoading: false,
        }));
      }
    },
    [
      state.allPokemonNames,
      state.pokemonCache,
      saveToStorage,
      removeFromStorage,
      savePokemonCache,
    ]
  );
  const input = useInput();

  const { searchQuery, setSearchQuery, isSearching, setIsSearching } =
    useSearchQuery();

  useEffect(() => {
    if (!isSearching) {
      fetchPokemons();
    }
  }, [state.currentPage, isSearching]);

  function handleSearch() {
    const query = input.value.trim();
    if (query) {
      setSearchQuery(query);
      setIsSearching(true);

      saveToStorage(STORAGE_KEYS.SEARCH_QUERY, query);
      saveToStorage(STORAGE_KEYS.IS_SEARCHING, true);

      searchPokemon(query);
    } else {
      handleClearSearch();
    }
  }

  const fetchPokemons = useCallback(async () => {
    setState((prevState) => ({ ...prevState, loading: true }));

    const offset = (state.currentPage - 1) * POKEMONS_PER_PAGE;
    const URL = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${POKEMONS_PER_PAGE}`;

    try {
      const response = await fetch(URL);
      const data: PokemonListResponse = await response.json();

      const pokemonPromises = data.results.map(
        async (pokemon: PokemonListItem) => {
          const cachedPokemon = state.pokemonCache.get(pokemon.name);
          if (cachedPokemon) {
            return cachedPokemon;
          }
          const pokemonResponse = await fetch(pokemon.url);
          const pokemonData: PokemonDetailResponse =
            await pokemonResponse.json();

          const newPokemon: Pokemon = {
            id: pokemonData.id,
            name: pokemonData.name,
            image: pokemonData.sprites.front_default,
            types: pokemonData.types.map((type: PokemonType) => type.type.name),
            height: pokemonData.height,
            weight: pokemonData.weight,
          };

          setState((prev) => {
            const newCache = new Map(
              prev.pokemonCache.set(newPokemon.name, newPokemon)
            );
            savePokemonCache(newCache);
            return { ...prev, pokemonCache: newCache };
          });

          return newPokemon;
        }
      );

      const pokemonList = await Promise.all(pokemonPromises);
      setState((prevState) => ({ ...prevState, pokemons: pokemonList }));
    } catch (error) {
      console.error('Error fetching Pokemon data:', error);
    } finally {
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  }, [state.currentPage, state.pokemonCache, savePokemonCache]);

  function handleThrowError() {
    throw new Error('Test error boundary');
  }

  function paginate(pageNumber: number): void {
    setState((prevState) => ({ ...prevState, currentPage: pageNumber }));
  }

  function showNextPage() {
    setState((prevState) => ({
      ...prevState,
      currentPage: prevState.currentPage + 1,
    }));
  }

  function showPrevPage() {
    setState((prevState) => ({
      ...prevState,
      currentPage: prevState.currentPage - 1,
    }));
  }
  function handleClearSearch() {
    input.onChange({
      target: { value: '' },
    } as ChangeEvent<HTMLInputElement>);
    setSearchQuery('');
    setIsSearching(false);
    setState((prev) => ({ ...prev, searchResults: [] }));

    removeFromStorage(STORAGE_KEYS.SEARCH_QUERY);
    removeFromStorage(STORAGE_KEYS.IS_SEARCHING);
    removeFromStorage(STORAGE_KEYS.SEARCH_RESULTS);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        input={input}
        loading={state.loading}
        onThrowError={handleThrowError}
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        isSearching={isSearching}
      />
      <Main
        loading={state.loading}
        pokemons={state.pokemons}
        isSearching={isSearching}
        searchQuery={searchQuery}
        pokemonsPerPage={POKEMONS_PER_PAGE}
        totalPokemonNumbers={TOTAL_POKEMON_NUMBERS}
        paginate={paginate}
        showNextPage={showNextPage}
        showPrevPage={showPrevPage}
        currentPage={state.currentPage}
        searchResults={state.searchResults}
        searchLoading={state.searchLoading}
        allPokemonNamesLoaded={state.allPokemonNames.length > 0}
      />
    </div>
  );
}

export default App;
