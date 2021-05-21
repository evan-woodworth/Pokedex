'use strict';
const axios = require('axios');
const db = require('../models');

function createInBatches(url){
  axios.get(url)
  .then(response => {
    let theMoves = response.data.results;
    theMoves.forEach(move=>{
      axios.get(move.url)
      .then(response=>{
        let moveDetails = response.data;
        let description = '';
        moveDetails.flavor_text_entries.forEach(entry=>{
          if(entry.language.name == "en"){
            description = entry.flavor_text;
          }
        })
        let title = '';
        moveDetails.names.forEach(entry=>{
          if(entry.language.name == "en"){
            title = entry.name;
          }
        })
        db.move.create({
          name: move.name,
          accuracy: moveDetails.accuracy,
          power: moveDetails.power,
          pp: moveDetails.pp,
          description,
          title
        })
        .then(newMove=>{
          db.type.findOne({where:{name:moveDetails.type.name}})
          .then(theType=>{newMove.addType(theType)})
        })
      })
    })
    if(response.data.next){createInBatches(response.data.next)}
  })
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
    createInBatches(`http://pokeapi.co/api/v2/move?limit=844`)
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('moves', null, {});
  }
};
