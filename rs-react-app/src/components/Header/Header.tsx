import type { UseInputReturn } from '../../hooks/useInput';

interface HeaderProps {
  input: UseInputReturn;
  loading: boolean;
  onThrowError: () => void;
  onSearch: () => void;
  onClearSearch: () => void;
  isSearching: boolean;
}

function Header({
  input,
  loading,
  onThrowError,
  onSearch,
  onClearSearch,
  isSearching,
}: HeaderProps): React.JSX.Element {
  return (
    <header className="header">
      <div className="header-container">
        <h1 className="search__title">Pokemon Search</h1>

        <div className="search__container">
          <div className="search-input-wrapper">
            <input
              type="text"
              className="search__input"
              placeholder="Search Pokemon by name..."
              value={input.value}
              onChange={input.onChange}
              disabled={loading}
            />

            <button
              className="search__button"
              onClick={onSearch}
              disabled={loading || !input.value.trim()}
              title="Search"
            >
              Search
            </button>

            {(isSearching || input.value) && (
              <button
                className="clear-button"
                onClick={onClearSearch}
                title="Clear search"
              >
                ❌
              </button>
            )}
          </div>
        </div>

        <button
          className="error-button"
          onClick={onThrowError}
          style={{ display: 'none' }}
        >
          Test Error
        </button>
      </div>
    </header>
  );
}

export default Header;
