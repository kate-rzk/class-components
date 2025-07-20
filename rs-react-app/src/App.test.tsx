import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App';

const mockListResponse = {
  results: [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
  ],
};

const mockDetailResponse = {
  id: 1,
  name: 'bulbasaur',
  sprites: { front_default: 'bulbasaur.png' },
  types: [{ type: { name: 'grass' } }],
  height: 7,
  weight: 69,
};

describe('App', () => {
  beforeEach(() => {
    vi.spyOn(global, 'fetch').mockImplementation((url: RequestInfo | URL) => {
      if (typeof url === 'string' && url.includes('pokemon?limit=20')) {
        return Promise.resolve({
          ok: true,
          json: async () => mockListResponse,
        } as Response);
      }

      return Promise.resolve({
        ok: true,
        json: async () => mockDetailResponse,
      } as Response);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Makes initial API call on component mount', async () => {
    render(<App />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon?limit=20'
      );
    });

    await waitFor(() => {
      // Ensure at least one element with "bulbasaur" is present
      expect(screen.getAllByText(/bulbasaur/i).length).toBeGreaterThan(0);
    });
  });
});
