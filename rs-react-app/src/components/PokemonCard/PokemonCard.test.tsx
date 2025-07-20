import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import Main from '../Main/Main';
import type { Pokemon } from '../../App';

describe('Main Component - Rendering Tests', () => {
  const mockPokemonData: Pokemon[] = [
    {
      id: 1,
      name: 'bulbasaur',
      image: 'https://example.com/bulbasaur.png',
      types: ['grass', 'poison'],
      height: 7,
      weight: 69,
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
      id: 143,
      name: 'snorlax',
      image: 'https://example.com/snorlax.png',
      types: ['normal'],
      height: 21,
      weight: 4600,
    }
  ];

  it('displays loading state correctly', () => {
    render(<Main loading={true} searchTerm="" pokemons={[]} />);

    expect(screen.getByText('Loading Pokemon...')).toBeInTheDocument();
  });

  it('displays "no pokemon found" message when pokemon array is empty', () => {
    render(<Main loading={false} searchTerm="" pokemons={[]} />);

    expect(screen.getByText('No Pokemon found.')).toBeInTheDocument();
    expect(screen.getByText('Pokemon Collection')).toBeInTheDocument();
  });

  it('renders main title when not loading', () => {
    render(<Main loading={false} searchTerm="" pokemons={mockPokemonData} />);

    expect(screen.getByText('Pokemon Collection')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Pokemon Collection');
  });

  it('renders correct number of pokemon cards', () => {
    render(<Main loading={false} searchTerm="" pokemons={mockPokemonData} />);

    // Проверяем по заголовкам покемонов
    expect(screen.getByText('#1 bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('#25 pikachu')).toBeInTheDocument();
    expect(screen.getByText('#143 snorlax')).toBeInTheDocument();

    // Проверяем количество изображений покемонов
    const pokemonImages = screen.getAllByRole('img');
    expect(pokemonImages).toHaveLength(3);
  });

  it('renders correct number of items with different amounts of data', () => {
    const singlePokemon = [mockPokemonData[0]];
    const { rerender } = render(<Main loading={false} searchTerm="" pokemons={singlePokemon} />);

    // Проверяем один покемон
    expect(screen.getAllByRole('img')).toHaveLength(1);
    expect(screen.getByText('#1 bulbasaur')).toBeInTheDocument();

    // Перерендериваем с двумя покемонами
    const twoPokemon = mockPokemonData.slice(0, 2);
    rerender(<Main loading={false} searchTerm="" pokemons={twoPokemon} />);

    expect(screen.getAllByRole('img')).toHaveLength(2);
    expect(screen.getByText('#1 bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('#25 pikachu')).toBeInTheDocument();

    // Перерендериваем с тремя покемонами
    rerender(<Main loading={false} searchTerm="" pokemons={mockPokemonData} />);

    expect(screen.getAllByRole('img')).toHaveLength(3);
    expect(screen.getByText('#1 bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('#25 pikachu')).toBeInTheDocument();
    expect(screen.getByText('#143 snorlax')).toBeInTheDocument();
  });

  it('renders pokemon cards with correct structure', () => {
    const { container } = render(<Main loading={false} searchTerm="" pokemons={[mockPokemonData[0]]} />);

    // Проверяем структуру компонента
    expect(container.querySelector('.main')).toBeInTheDocument();
    expect(container.querySelector('.pokemon-grid')).toBeInTheDocument();
    expect(container.querySelector('.pokemon-card')).toBeInTheDocument();
  });

  it('does not render pokemon grid when loading', () => {
    const { container } = render(<Main loading={true} searchTerm="" pokemons={mockPokemonData} />);

    expect(container.querySelector('.pokemon-grid')).not.toBeInTheDocument();
    expect(screen.queryByText('#1 bulbasaur')).not.toBeInTheDocument();
  });

  it('renders pokemon with all their details', () => {
    render(<Main loading={false} searchTerm="" pokemons={[mockPokemonData[0]]} />);

    // Проверяем детали первого покемона
    expect(screen.getByText('#1 bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('grass')).toBeInTheDocument();
    expect(screen.getByText('poison')).toBeInTheDocument();
    expect(screen.getByText('Height: 0.7m')).toBeInTheDocument();
    expect(screen.getByText('Weight: 6.9kg')).toBeInTheDocument();
    expect(screen.getByAltText('bulbasaur')).toBeInTheDocument();
  });
});
