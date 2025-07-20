import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import Main from './Main';
import type { Pokemon } from '../../App';

vi.mock('../../PokemonCard', () => ({
  default: ({ pokemon }: { pokemon: Pokemon }) => (
    <div data-testid={`pokemon-card-${pokemon.id}`}>{pokemon.name}</div>
  ),
}));

describe('Main Component - Rendering Tests', () => {
  const mockPokemons: Pokemon[] = [
    {
      id: 1,
      name: 'bulbasaur',
      image: 'https://example.com/bulbasaur.png',
      types: ['grass', 'poison'],
      height: 7,
      weight: 69,
    },
    {
      id: 4,
      name: 'charmander',
      image: 'https://example.com/charmander.png',
      types: ['fire'],
      height: 6,
      weight: 85,
    },
    {
      id: 7,
      name: 'squirtle',
      image: 'https://example.com/squirtle.png',
      types: ['water'],
      height: 5,
      weight: 90,
    },
    {
      id: 25,
      name: 'pikachu',
      image: 'https://example.com/pikachu.png',
      types: ['electric'],
      height: 4,
      weight: 60,
    },
    {
      id: 39,
      name: 'jigglypuff',
      image: 'https://example.com/jigglypuff.png',
      types: ['normal', 'fairy'],
      height: 5,
      weight: 55,
    },
  ];

  it('renders correct number of PokemonCard components when data is provided', () => {
    const props = {
      loading: false,
      searchTerm: '',
      pokemons: mockPokemons,
    };

    render(<Main {...props} />);

    mockPokemons.forEach((pokemon) => {
      expect(
        screen.getByTestId(`pokemon-card-${pokemon.id}`)
      ).toBeInTheDocument();
      expect(screen.getByText(pokemon.name)).toBeInTheDocument();
    });

    const pokemonGrid = document.querySelector('.pokemon-grid');
    expect(pokemonGrid?.children).toHaveLength(mockPokemons.length);
    expect(pokemonGrid?.children).toHaveLength(5);
  });

  it('renders correct number of items with different amounts of data', () => {
    const testCases = [
      { pokemons: [], expectedCount: 0 },
      { pokemons: [mockPokemons[0]], expectedCount: 1 },
      { pokemons: mockPokemons.slice(0, 3), expectedCount: 3 },
      { pokemons: mockPokemons, expectedCount: 5 },
    ];

    testCases.forEach(({ pokemons, expectedCount }) => {
      const { unmount } = render(
        <Main loading={false} searchTerm="" pokemons={pokemons} />
      );

      if (expectedCount === 0) {
        expect(screen.getByText('No Pokemon found.')).toBeInTheDocument();
        expect(document.querySelector('.pokemon-grid')).not.toBeInTheDocument();
      } else {
        const pokemonGrid = document.querySelector('.pokemon-grid');
        expect(pokemonGrid).toBeInTheDocument();
        expect(pokemonGrid?.children).toHaveLength(expectedCount);

        pokemons.forEach((pokemon) => {
          expect(
            screen.getByTestId(`pokemon-card-${pokemon.id}`)
          ).toBeInTheDocument();
        });
      }

      unmount();
    });
  });

  it('does not render pokemon cards when loading is true', () => {
    const props = {
      loading: true,
      searchTerm: '',
      pokemons: mockPokemons,
    };

    render(<Main {...props} />);

    expect(screen.getByText('Loading Pokemon...')).toBeInTheDocument();
    expect(document.querySelector('.pokemon-grid')).not.toBeInTheDocument();
  });

  it('renders pokemon grid container when pokemons are provided', () => {
    const props = {
      loading: false,
      searchTerm: '',
      pokemons: mockPokemons,
    };

    render(<Main {...props} />);

    const pokemonGrid = document.querySelector('.pokemon-grid');
    expect(pokemonGrid).toBeInTheDocument();

    expect(pokemonGrid?.children).toHaveLength(mockPokemons.length);
  });
});
