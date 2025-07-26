import type { Pokemon } from '../../App';
import PokemonCard from '../Card/PokemonCard';
import Search from '../Header/Search';

interface MainProps {
  loading: boolean;
  pokemons: Pokemon[];
  isSearching: boolean;
  searchQuery: string;
}

function Main({
  loading,
  pokemons,
  isSearching,
  searchQuery,
}: MainProps): React.JSX.Element {
  if (loading) {
    return <main className="main__loading">Loading Pokemon...</main>;
  }

  if (isSearching && searchQuery.trim()) {
    return (
      <main>
        <Search pokemons={pokemons} searchQuery={searchQuery} />
      </main>
    );
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

export default Main;
