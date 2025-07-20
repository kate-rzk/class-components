import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from './Header';

describe('Search', () => {
  it('renders search input and search button', () => {
    const props = {
      searchTerm: '',
      onSearchChange: vi.fn(),
      onSearch: vi.fn(),
      loading: false,
      onThrowError: vi.fn(),
    };

    render(<Header {...props} />);

    const searchInput = screen.getByPlaceholderText('Search Pokemon...');
    const searchButton = screen.getByRole('button', { name: 'Search' });
    expect(searchInput).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
  });
});
