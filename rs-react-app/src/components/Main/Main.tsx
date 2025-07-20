import { Component } from 'react';
import type { Pokemon } from '../../App';
import PokemonCard from '../../PokemonCard';

interface MainProps {
  loading: boolean;
  searchTerm: string;
  pokemons: Pokemon[];
}

class Main extends Component<MainProps> {
  render() {
    const { loading, pokemons } = this.props;

    if (loading) {
      return <main className="main__loading">Loading Pokemon...</main>;
    }

    return (
      <main className="main">
        <h2 className="main__title">Pokemon Collection</h2>
        {pokemons.length === 0 ? (
          <p className="text">No Pokemon found.</p>
        ) : (
          <div className="pokemon-grid">
            {pokemons.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>
        )}
      </main>
    );
  }
}

export default Main;
