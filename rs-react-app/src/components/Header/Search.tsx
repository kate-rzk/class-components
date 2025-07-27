import type { Pokemon } from '../../App';
import PokemonCard from '../Card/PokemonCard';

interface SearchProps {
  pokemons: Pokemon[];
  searchQuery: string;
  loading?: boolean;
}

function Search({
  pokemons,
  searchQuery,
  loading,
}: SearchProps): React.JSX.Element {
  if (loading) {
    return (
      <div className="search-loading">
        <p className="text">Searching through all Pokemon...</p>
      </div>
    );
  }

  if (pokemons.length > 0) {
    return (
      <div className="pokemon-grid">
        {pokemons.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>
    );
  }

  return (
    <div className="no-results">
      <p className="text">No Pokemon found matching `{searchQuery}`.</p>
    </div>
  );
}

export default Search;
