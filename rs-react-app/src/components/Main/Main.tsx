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
  searchResults: Pokemon[];
  searchLoading: boolean;
  allPokemonNamesLoaded: boolean;
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
  searchResults,
  searchLoading,
  allPokemonNamesLoaded,
}: MainProps): React.JSX.Element {
  if (loading && !isSearching) {
    return <main className="main__loading">Loading Pokemon...</main>;
  }

  if (!allPokemonNamesLoaded && !isSearching) {
    return <main className="main__loading">Loading Pokemon database...</main>;
  }

  if (isSearching && searchQuery.trim()) {
    return (
      <main>
        <div className="search-header">
          <h2 className="main__title">
            Search Results for `{searchQuery}`
            {!searchLoading && searchResults.length > 0 && (
              <span className="search-count">
                {' '}
                ({searchResults.length} found)
              </span>
            )}
          </h2>
        </div>
        <Search
          pokemons={searchResults}
          searchQuery={searchQuery}
          loading={searchLoading}
        />
        <Pagination
          pokemonsPerPage={pokemonsPerPage}
          totalPokemonNumbers={totalPokemonNumbers}
          paginate={paginate}
          currentPage={currentPage}
          showNextPage={showNextPage}
          showPrevPage={showPrevPage}
        />
      </main>
    );
  }

  return (
    <main className="main">
      <h2 className="main__title">Pokemon Collection</h2>
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
