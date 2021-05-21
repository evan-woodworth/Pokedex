'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class move extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.move.belongsToMany(models.pokemon, {through:'movesPokemons'});
      models.move.belongsToMany(models.type, {through:'movesTypes'});
    }
  };
  move.init({
    name: DataTypes.STRING,
    accuracy: DataTypes.INTEGER,
    power: DataTypes.INTEGER,
    pp: DataTypes.INTEGER,
    description: DataTypes.STRING,
    title: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'move',
  });
  return move;
};