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
}

function App(): React.JSX.Element {
  const [state, setState] = useState<AppState>({
    loading: false,
    pokemons: [],
    currentPage: 1,
    offset: 0,
  });

  const POKEMONS_PER_PAGE: number = 20;
  const TOTAL_POKEMON_NUMBERS: number = 1302;

  const input = useInput();

  const { searchQuery, setSearchQuery, isSearching, setIsSearching } =
    useSearchQuery();

  useEffect(() => {
    if (searchQuery && isSearching) {
      input.onChange({
        target: { value: searchQuery },
      } as ChangeEvent<HTMLInputElement>);
    }
  }, []);

  useEffect(() => {
    fetchPokemons();
  }, [state.currentPage]);

  function handleSearch() {
    const query = input.value.trim();
    if (query) {
      setSearchQuery(query);
      setIsSearching(true);
    } else {
      setSearchQuery('');
      setIsSearching(false);
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
          const pokemonResponse = await fetch(pokemon.url);
          const pokemonData: PokemonDetailResponse =
            await pokemonResponse.json();

          return {
            id: pokemonData.id,
            name: pokemonData.name,
            image: pokemonData.sprites.front_default,
            types: pokemonData.types.map((type: PokemonType) => type.type.name),
            height: pokemonData.height,
            weight: pokemonData.weight,
          };
        }
      );

      const pokemonList = await Promise.all(pokemonPromises);
      setState((prevState) => ({ ...prevState, pokemons: pokemonList }));
    } catch (error) {
      console.error('Error fetching Pokemon data:', error);
    } finally {
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  }, [state.currentPage]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        input={input}
        loading={state.loading}
        onThrowError={handleThrowError}
        onSearch={handleSearch}
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
      />
    </div>
  );
}

export default App;
