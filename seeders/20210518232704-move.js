'use strict';
const axios = require('axios');
const db = require('../models');

const fetchMoveData = async () => {
  const response = await axios.get("http://pokeapi.co/api/v2/move?limit=844");
  const { results } = response.data;
  let theCount = 0;
  for await (const move of results) {
    const moveResponse = await axios.get(move.url);
    const moveDetails = moveResponse.data;
    let title = '';
    let description = '';
    moveDetails.flavor_text_entries.forEach(entry=>{
      if(entry.language.name == "en"){
        description = entry.flavor_text;
      }
    })
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
    theCount++;
    console.clear()
    console.log(`${theCount} of 844`)
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    fetchMoveData();
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.bulkDelete('moves', null, {});
  }
};
