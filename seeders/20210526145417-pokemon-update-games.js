'use strict';
const axios = require('axios');
const db = require('../models');

const fetchPokemonData = async () => {
  const response = await axios.get("http://pokeapi.co/api/v2/pokemon-species/?limit=898");
  const { results } = response.data;
  let theCount = 0;
  try {
    for await (const species of results) {
      const speciesResponse = await axios.get(species.url);
      const speciesDetails = speciesResponse.data;
      let gameList = [];
      // find the pokemon's pokedexes
      for await (const index of speciesDetails.pokedex_numbers) {
        const pokedexResponse = await axios.get(index.pokedex.url)
        const pokedexDetails = pokedexResponse.data;
        if (pokedexDetails.version_groups) {
          for await (const groups of pokedexDetails.version_groups) {
            const groupsResponse = await axios.get(groups.url);
            const groupsDetails = groupsResponse.data;
            for (const game of groupsDetails.versions) {
              gameList.push(game.name);
            }
          }
        }
      }
      // update the pokemon's games
      // find the pokemon
      const thePokemon = await db.pokemon.findOne({
        where: {name:speciesDetails.name},
        include: [db.game]
      });
      for await (const game of thePokemon.games) {
        await thePokemon.removeGames(game);
      }
      for await (const game of gameList) {
        const theGame = await db.game.findOne({
          where: {name:game}
        });
        await thePokemon.addGames(theGame);
      }
  
      theCount++;
      console.clear()
      // show the games
      console.log(`-------- ${speciesDetails.name} ---`)
      console.log(gameList)
      console.log(`${theCount} of 898`)
    }
  }
  catch(error){
    console.log('---------ERROR HERE --------');
    console.log(error);
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
   fetchPokemonData()
  },

  down: async (queryInterface, Sequelize) => {
  }
};
