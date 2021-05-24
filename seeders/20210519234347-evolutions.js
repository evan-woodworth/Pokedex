'use strict';
const axios = require('axios');
const db = require('../models');

const fetchEvolutionData = async () => {
  const response = await axios.get('https://pokeapi.co/api/v2/evolution-chain/?limit=467');
  const { results } = response.data;
  let theCount = 0;
  try{
  for await (const chain of results) {
    const chainResponse = await axios.get(chain.url);
    const basePokemon = chainResponse.data.chain;

    const getEvolution = async (basePokemon, evolutions) => {
      const baseForm = await db.pokemon.findOne({where:{name:basePokemon.species.name}});
      for (const evolution of evolutions) {
        const nextForm = await db.pokemon.findOne({where:{name:evolution.species.name}});
        console.log(`${baseForm.name} evolves to ${nextForm.name}`)
        await nextForm.setEvolvesFrom(baseForm);
        await baseForm.addEvolvesTo(nextForm);  
        if(evolution.evolves_to) {
          getEvolution(evolution, evolution.evolves_to)
        }
      }
    }
    theCount++;
    console.clear()
    console.log(`${theCount} of 467`)
    getEvolution(basePokemon, basePokemon.evolves_to)
  }}
  catch(error){
    console.log('---------ERROR HERE --------');
    console.log(error);
  }
}


module.exports = {
  up: async (queryInterface, Sequelize) => {
    fetchEvolutionData();
  },

  down: async (queryInterface, Sequelize) => {
  }
};
