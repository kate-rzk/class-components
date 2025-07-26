import type { UseInputReturn } from '../../hooks/useInput';

interface HeaderProps {
  input: UseInputReturn;
  loading: boolean;
  onThrowError: () => void;
  onSearch: () => void;
}

function Header({
  input,
  loading,
  onThrowError,
  onSearch,
}: HeaderProps): React.JSX.Element {
  return (
    <header className="header">
      <div className="header-container">
        <div className="search">
          <h1 className="search__title">Pokemon Search</h1>
          <div className="search__container">
            <input
              type="text"
              placeholder="Search Pokemon..."
              {...input}
              className="search__input"
            />
            <button
              onClick={onSearch}
              disabled={loading}
              className="search__button"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          <button onClick={onThrowError} className="button__throw-error">
            Test Error Boundary
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
