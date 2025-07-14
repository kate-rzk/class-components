import { Component } from 'react';
import type { ReactNode } from 'react';
import './header.css';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSearch: () => void;
  loading: boolean;
  onThrowError: () => void;
}

class Header extends Component<HeaderProps> {
  render(): ReactNode {
    const { searchTerm, onSearchChange, onSearch, loading, onThrowError } =
      this.props;

    return (
      <header className="header">
        <div className="header-container">
          <div className="search">
            <h1 className="search__title">Pokemon Search</h1>

            <div className="search__container">
              <input
                type="text"
                placeholder="Search Pokemon..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
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
}

export default Header;
