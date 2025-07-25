import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header/Header';
import Main from './components/Main/Main';

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
  searchTerm: string;
  loading: boolean;
  pokemons: Pokemon[];
}

function App(): React.JSX.Element {
  const [state, setState] = useState<AppState>({
    searchTerm: '',
    loading: false,
    pokemons: [],
  });

  useEffect(() => {
    fetchPokemons();
  }, []);

  const fetchPokemons = useCallback(async () => {
    setState((prevState) => ({ ...prevState, loading: true }));
    try {
      const response = await fetch(
        'https://pokeapi.co/api/v2/pokemon?limit=20'
      );
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
  }, []);

  function handleSearchChange(term: string) {
    setState((prevState) => ({ ...prevState, searchTerm: term }));
  }

  function handleSearch() {
    console.log('Searching for:', state.searchTerm);
  }

  function handleThrowError() {
    throw new Error('Test error boundary');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        searchTerm={state.searchTerm}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
        loading={state.loading}
        onThrowError={handleThrowError}
      />
      <Main
        loading={state.loading}
        searchTerm={state.searchTerm}
        pokemons={state.pokemons}
      />
    </div>
  );
}

export default App;
