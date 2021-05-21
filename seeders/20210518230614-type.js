'use strict';
const axios = require('axios');
const db = require('../models');

const fetchTypeData = async () => {
  const response = await axios.get("http://pokeapi.co/api/v2/type/");
  const { results } = response.data;
  let theCount = 0;
  for await (const type of results) {
    const typeResponse = await axios.get(type.url);
    const typeDetails = typeResponse.data;
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
    theCount++;
    console.clear()
    console.log(`${theCount} of 20`)
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
    //  axios.get(`http://pokeapi.co/api/v2/type/`)
    //  .then(response => {
    //    let theTypes = response.data.results;
    //    theTypes.forEach(type=>{
    //     axios.get(type.url)
    //     .then(results=>{
    //       let typeDetails = results.data;
    //       let title = '';
    //       typeDetails.names.forEach(entry=>{
    //         if(entry.language.name == "en"){
    //           title = entry.name;
    //         }
    //       })
    //       db.type.create({
    //         name:type.name,
    //         title
    //       })
    //     })
        
    //    });
    //  })
    fetchTypeData();
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
