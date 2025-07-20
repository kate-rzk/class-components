import { Component } from 'react';
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

class App extends Component<Record<string, never>, AppState> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      searchTerm: '',
      loading: false,
      pokemons: [],
    };
  }

  componentDidMount() {
    this.fetchPokemons();
  }

  fetchPokemons = async () => {
    this.setState({ loading: true });
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
      this.setState({ pokemons: pokemonList });
    } catch (error) {
      console.error('Error fetching Pokemon data:', error);
    } finally {
      this.setState({ loading: false });
    }
  };

  handleSearchChange = (term: string) => {
    this.setState({ searchTerm: term });
  };

  handleSearch = () => {
    console.log('Searching for:', this.state.searchTerm);
  };

  handleThrowError = () => {
    throw new Error('Test error boundary');
  };

  render() {
    const { searchTerm, loading, pokemons } = this.state;

    return (
      <div className="min-h-screen bg-gray-50">
        <Header
          searchTerm={searchTerm}
          onSearchChange={this.handleSearchChange}
          onSearch={this.handleSearch}
          loading={loading}
          onThrowError={this.handleThrowError}
        />
        <Main loading={loading} searchTerm={searchTerm} pokemons={pokemons} />
      </div>
    );
  }
}

export default App;
