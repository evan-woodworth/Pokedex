'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.type.belongsToMany(models.pokemon, {through:'typesPokemons'});
      models.type.belongsToMany(models.move, {through:'movesTypes'});
    }
  };
  type.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'type',
  });
  return type;
};