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
      theGames.forEach(game=>{
        axios.get(game.url)
        .then(results=>{
          let gameDetails = results.data;
          let title = '';
          gameDetails.names.forEach(entry=>{
            if(entry.language.name == "en"){
              title = entry.name;
            }
          })
          db.game.create({
            name:game.name,
            title
          });
        })
      });
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
