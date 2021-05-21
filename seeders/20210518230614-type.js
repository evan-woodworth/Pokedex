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
     axios.get(`http://pokeapi.co/api/v2/type/`)
     .then(response => {
       let theTypes = response.data.results;
       theTypes.forEach(type=>{
        axios.get(type.url)
        .then(results=>{
          let typeDetails = results.data;
          let title = '';
          typeDetails.names.forEach(entry=>{
            if(entry.language.name == "en"){
              title = entry.name;
            }
          })
          db.type.create({
            name:type.name,
            title
          })
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
     await queryInterface.bulkDelete('types', null, {});
  }
};
