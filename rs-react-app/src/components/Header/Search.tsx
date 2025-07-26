import type { Pokemon } from '../../App';
import PokemonCard from '../Card/PokemonCard';

interface SearchProps {
  pokemons: Pokemon[];
  searchQuery: string;
}

function Search({ pokemons, searchQuery }: SearchProps): React.JSX.Element {
  const resultPokemonSearch = pokemons
    .filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map((pokemon) => <PokemonCard key={pokemon.id} pokemon={pokemon} />);

  if (resultPokemonSearch.length > 0) {
    return <div className="pokemon-grid">{resultPokemonSearch}</div>;
  } else {
    return (
      <p className="text">
        Not found. Enter another name or an empty string to return to the
        collection.
      </p>
    );
  }
}

export default Search;
