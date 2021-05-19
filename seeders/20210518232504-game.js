'use strict';
const axios = require('axios');
const db = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    axios.get(`http://pokeapi.co/api/v2/version?limit=34`)
    .then(response => {
      let theGames = response.data.results;
      theGames.forEach(game=>db.game.create({name:game.name}));
    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('games', null, {});
  }
};
