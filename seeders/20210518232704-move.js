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
    axios.get(`http://pokeapi.co/api/v2/move?limit=844`)
    .then(response => {
      let theMoves = response.data.results;
      theMoves.forEach(move=>{
        axios.get(move.url)
        .then(response=>{
            let moveDetails = response.data;
            db.move.create({
                name: move.name,
                accuracy: moveDetails.accuracy,
                power: moveDetails.power,
                pp: moveDetails.pp
            })
            .then(newMove=>{
                db.type.findOne({where:{name:moveDetails.type.name}})
                .then(theType=>{newMove.addType(theType)})
            })
        })
      })
    })
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
