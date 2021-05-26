'use strict';
const axios = require('axios');
const db = require('../models');

const fetchPokemonData = async () => {
  const response = await axios.get("http://pokeapi.co/api/v2/pokemon-species/?limit=898");
  const { results } = response.data;
  let theCount = 0;
  for await (const species of results) {
    const speciesResponse = await axios.get(species.url);
    const speciesDetails = speciesResponse.data;
    const pokemonResults = await axios.get(speciesDetails.varieties[0].pokemon.url);
    const pokemonDetails = pokemonResults.data;
    let flavorText = '';
    let title = '';
    let typeList = [];
    let moveList = [];
    // find the pokemon's title
    speciesDetails.names.forEach(entry=>{
      if(entry.language.name == "en"){
        title = entry.name;
      }
    })
    // find the flavor text
    speciesDetails.flavor_text_entries.forEach(entry=>{
      if(entry.language.name == "en"){
        flavorText = entry.flavor_text;
      }
    })
    // find the pokemon's types
    pokemonDetails.types.forEach(typeCase=>{typeList.push(typeCase.type.name)});
    // find the pokemon's moves
    pokemonDetails.moves.forEach(moveCase=>{
      moveCase.version_group_details.forEach(vgCase=>{
        let levelLearned = vgCase.level_learned_at;
        let vgMethod = vgCase.move_learn_method.name;
        let name = moveCase.move.name;
        if( (vgMethod == "level-up") && (moveList.length<4) 
          && !(moveList.includes(name)) && (levelLearned === 1) ){
          moveList.push(name);
        }
      });
    });
    // create the pokemon
    const newPokemon = await db.pokemon.create({
      name: speciesDetails.name,
      number: pokemonDetails.id,
      sprite: pokemonDetails.sprites.other["official-artwork"].front_default,
      height: pokemonDetails.height,
      weight: pokemonDetails.weight,
      hp: pokemonDetails.stats[0].base_stat,
      attack: pokemonDetails.stats[1].base_stat,
      defense: pokemonDetails.stats[2].base_stat,
      specialAttack: pokemonDetails.stats[3].base_stat,
      specialDefense: pokemonDetails.stats[4].base_stat,
      speed: pokemonDetails.stats[5].base_stat,
      title,
      flavorText
    });
    // add the pokemon's types, moves, and games
    const theTypes = await db.type.findAll({where:{name:typeList}});
    const theMoves = await db.move.findAll({where:{name:moveList}});
    theTypes.forEach(type=>{newPokemon.addType(type)});
    theMoves.forEach(move=>{newPokemon.addMove(move)});

    theCount++;
    console.clear()
    console.log(`${theCount} of 898`)
  }
}


module.exports = {
  up: async (queryInterface, Sequelize) => {
    fetchPokemonData();
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('pokemons', null, {});
  }
};
