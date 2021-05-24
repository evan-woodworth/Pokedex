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
    fetchTypeData();
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.bulkDelete('types', null, {});
  }
};
