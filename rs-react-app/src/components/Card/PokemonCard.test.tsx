import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import PokemonCard from './PokemonCard';
import type { Pokemon } from '../../App';

describe('PokemonCard Component - Rendering Tests', () => {
  const mockPokemon: Pokemon = {
    id: 25,
    name: 'pikachu',
    image: 'https://example.com/pikachu.png',
    types: ['electric'],
    height: 4,
    weight: 60,
  };

  it('displays item name and description correctly', () => {
    render(<PokemonCard pokemon={mockPokemon} />);

    expect(screen.getByText('#25 pikachu')).toBeInTheDocument();
    expect(screen.getByText('electric')).toBeInTheDocument();
    expect(screen.getByText('Height: 0.4m')).toBeInTheDocument();
    expect(screen.getByText('Weight: 6kg')).toBeInTheDocument();
    expect(screen.getByAltText('pikachu')).toBeInTheDocument();
    expect(screen.getByAltText('pikachu')).toHaveAttribute(
      'src',
      'https://example.com/pikachu.png'
    );
  });

  it('displays multiple types correctly', () => {
    const pokemonWithMultipleTypes: Pokemon = {
      id: 1,
      name: 'bulbasaur',
      image: 'https://example.com/bulbasaur.png',
      types: ['grass', 'poison'],
      height: 7,
      weight: 69,
    };

    render(<PokemonCard pokemon={pokemonWithMultipleTypes} />);

    expect(screen.getByText('grass')).toBeInTheDocument();
    expect(screen.getByText('poison')).toBeInTheDocument();

    const grassType = screen.getByText('grass');
    const poisonType = screen.getByText('poison');

    expect(grassType).toHaveClass('pokemon-card__type--grass');
    expect(poisonType).toHaveClass('pokemon-card__type--poison');
  });

  it('handles missing props gracefully', () => {
    const pokemonWithMissingData: Pokemon = {
      id: 0,
      name: '',
      image: '',
      types: [],
      height: 0,
      weight: 0,
    };

    render(<PokemonCard pokemon={pokemonWithMissingData} />);

    expect(screen.getByText('#0')).toBeInTheDocument();
    expect(screen.getByText('Height: 0m')).toBeInTheDocument();
    expect(screen.getByText('Weight: 0kg')).toBeInTheDocument();
    expect(screen.getByAltText('')).toBeInTheDocument();
  });

  it('renders correct CSS classes', () => {
    const { container } = render(<PokemonCard pokemon={mockPokemon} />);

    expect(container.querySelector('.pokemon-card')).toBeInTheDocument();
    expect(
      container.querySelector('.pokemon-card__image-container')
    ).toBeInTheDocument();
    expect(container.querySelector('.pokemon-card__image')).toBeInTheDocument();
    expect(
      container.querySelector('.pokemon-card__content')
    ).toBeInTheDocument();
    expect(container.querySelector('.pokemon-card__name')).toBeInTheDocument();
    expect(container.querySelector('.pokemon-card__types')).toBeInTheDocument();
    expect(container.querySelector('.pokemon-card__type')).toBeInTheDocument();
    expect(container.querySelector('.pokemon-card__stats')).toBeInTheDocument();
    expect(container.querySelectorAll('.pokemon-card__stat')).toHaveLength(2);
  });

  it('calculates height and weight correctly', () => {
    const pokemonWithLargeStats: Pokemon = {
      id: 143,
      name: 'snorlax',
      image: 'https://example.com/snorlax.png',
      types: ['normal'],
      height: 21,
      weight: 4600,
    };

    render(<PokemonCard pokemon={pokemonWithLargeStats} />);

    expect(screen.getByText('Height: 2.1m')).toBeInTheDocument();
    expect(screen.getByText('Weight: 460kg')).toBeInTheDocument();
  });
});
