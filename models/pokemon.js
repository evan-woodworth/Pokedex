'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pokemon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.pokemon.belongsToMany(models.user,{through:'usersPokemons'});
      models.pokemon.belongsToMany(models.move,{through:'movesPokemons'});
      models.pokemon.belongsToMany(models.type,{through:'typesPokemons'});
      models.pokemon.belongsToMany(models.game,{through:'gamesPokemons'});
      models.pokemon.belongsTo(models.pokemon, {
        foreignKey: 'evolutionOneId',
        targetKey: 'id'
      })
      models.pokemon.belongsTo(models.pokemon, {
        foreignKey: 'evolutionTwoId',
        targetKey: 'id'
      })
    }
  };
  pokemon.init({
    name: DataTypes.STRING,
    number: DataTypes.INTEGER,
    sprite: DataTypes.STRING,
    height: DataTypes.INTEGER,
    weight: DataTypes.INTEGER,
    hp: DataTypes.INTEGER,
    attack: DataTypes.INTEGER,
    defense: DataTypes.INTEGER,
    specialAttack: DataTypes.INTEGER,
    specialDefense: DataTypes.INTEGER,
    speed: DataTypes.INTEGER,
    evolutionOneId: DataTypes.INTEGER,
    evolutionTwoId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'pokemon',
  });
  return pokemon;
};