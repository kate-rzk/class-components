import { Component } from 'react';
import type { Pokemon } from '../../App';

interface PokemonCardProps {
  pokemon: Pokemon;
}

class PokemonCard extends Component<PokemonCardProps> {
  render() {
    const { pokemon } = this.props;

    return (
      <div className="pokemon-card">
        <div className="pokemon-card__image-container">
          <img
            src={pokemon.image}
            alt={pokemon.name}
            className="pokemon-card__image"
          />
        </div>
        <div className="pokemon-card__content">
          <h3 className="pokemon-card__name">
            #{pokemon.id} {pokemon.name}
          </h3>
          <div className="pokemon-card__types">
            {pokemon.types.map((type, index) => (
              <span
                key={index}
                className={`pokemon-card__type pokemon-card__type--${type}`}
              >
                {type}
              </span>
            ))}
          </div>
          <div className="pokemon-card__stats">
            <span className="pokemon-card__stat">
              Height: {pokemon.height / 10}m
            </span>
            <span className="pokemon-card__stat">
              Weight: {pokemon.weight / 10}kg
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default PokemonCard;
