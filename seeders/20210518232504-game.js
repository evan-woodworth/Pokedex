'use strict';
const axios = require('axios');
const db = require('../models');

const fetchGameData = async () => {
  const response = await axios.get("http://pokeapi.co/api/v2/version?limit=34");
  const { results } = response.data;
  let theCount = 0;
  for await (const game of results) {
    const gameResponse = await axios.get(game.url);
    const gameDetails = gameResponse.data;
    let title = '';
    gameDetails.names.forEach(entry=>{
      if(entry.language.name == "en"){
        title = entry.name;
      }
    })
    db.game.create({
      name:game.name,
      title
    })
    theCount++;
    console.clear()
    console.log(`${theCount} of 34`)
  }
}

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
    // axios.get(`http://pokeapi.co/api/v2/version?limit=34`)
    // .then(response => {
    //   let theGames = response.data.results;
    //   theGames.forEach(game=>{
    //     axios.get(game.url)
    //     .then(results=>{
    //       let gameDetails = results.data;
    //       let title = '';
    //       gameDetails.names.forEach(entry=>{
    //         if(entry.language.name == "en"){
    //           title = entry.name;
    //         }
    //       })
    //       db.game.create({
    //         name:game.name,
    //         title
    //       });
    //     })
    //   });
    // })
    fetchGameData();
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
