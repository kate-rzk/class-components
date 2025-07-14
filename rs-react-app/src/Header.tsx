import { Component } from 'react';
import type { ReactNode } from 'react';

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
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900">Pokemon Search</h1>

            <div className="flex gap-2 w-full max-w-md">
              <input
                type="text"
                placeholder="Search Pokemon..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg outline-none"
              />
              <button
                onClick={onSearch}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-lg"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>

            <button
              onClick={onThrowError}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-3 rounded text-sm"
            >
              Test Error Boundary
            </button>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
