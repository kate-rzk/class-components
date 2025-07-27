import PokemonCard from '../Card/PokemonCard';
import type { Pokemon } from '../../App';
import Search from '../Header/Search';
import Pagination from '../Pagination/Pagination';
interface MainProps {
  loading: boolean;
  pokemons: Pokemon[];
  isSearching: boolean;
  searchQuery: string;
  pokemonsPerPage: number;
  totalPokemonNumbers: number;
  paginate: (pageNumber: number) => void;
  showNextPage: () => void;
  showPrevPage: () => void;
  currentPage: number;
}
function Main({
  loading,
  pokemons,
  isSearching,
  searchQuery,
  pokemonsPerPage,
  totalPokemonNumbers,
  showNextPage,
  showPrevPage,
  paginate,
  currentPage,
}: MainProps): React.JSX.Element {
  if (loading) {
    return <main className="mainloading">Loading Pokemon...</main>;
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
      <h2 className="maintitle">Pokemon Collection</h2>
      {pokemons.length === 0 ? (
        <p className="text">No Pokemon found.</p>
      ) : (
        <>
          <div className="pokemon-grid">
            {pokemons.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>
          <Pagination
            pokemonsPerPage={pokemonsPerPage}
            totalPokemonNumbers={totalPokemonNumbers}
            paginate={paginate}
            currentPage={currentPage}
            showNextPage={showNextPage}
            showPrevPage={showPrevPage}
          />
        </>
      )}
    </main>
  );
}

export default Main;
