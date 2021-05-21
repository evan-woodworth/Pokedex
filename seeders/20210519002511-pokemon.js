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
    let gameList = [];
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
    // find the pokemon's games
    pokemonDetails.game_indices.forEach(gameIndex=>{
      gameList.push(gameIndex.version.name);
    })
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
    const theGames = await db.game.findAll({where:{name:gameList}});
    theTypes.forEach(type=>{newPokemon.addType(type)});
    theMoves.forEach(move=>{newPokemon.addMove(move)});
    theGames.forEach(game=>{newPokemon.addGame(game)});

    theCount++;
    console.clear()
    console.log(`${theCount} of 898`)
  }
}



// function createInBatches(url){
//   axios.get(url)
//   .then(response => {
//     let thePokemon = response.data.results;
//     thePokemon.forEach(pokemon=>{
//       axios.get(pokemon.url)
//       .then(response=>{
//         let pokemonSpecies = response.data;
//         axios.get(pokemonSpecies.varieties[0].pokemon.url)
//         .then(results=>{
//           let pokemonDetails = results.data;
//           let flavorText = '';
//           let title = '';
//           let typeList = [];
//           let moveList = [];
//           let gameList = [];
//           // find the pokemon's title
//           pokemonSpecies.names.forEach(entry=>{
//             if(entry.language.name == "en"){
//               title = entry.name;
//             }
//           })
//           // find the flavor text
//           pokemonSpecies.flavor_text_entries.forEach(entry=>{
//             if(entry.language.name == "en"){
//               flavorText = entry.flavor_text;
//             }
//           })
//           // find the pokemon's type(s)
//           pokemonDetails.types.forEach(typeCase=>{typeList.push(typeCase.type.name)});
//           // find the pokemon's moves
//           pokemonDetails.moves.forEach(moveCase=>{
//             moveCase.version_group_details.forEach(vgCase=>{
//               let levelLearned = vgCase.level_learned_at;
//               let vgMethod = vgCase.move_learn_method.name;
//               let name = moveCase.move.name;
//               if( (vgMethod == "level-up") && (moveList.length<4) 
//                 && !(moveList.includes(name)) && (levelLearned === 1) ){
//                 moveList.push(name);
//               }
//             });
//           });
//           // find the pokemon's games
//           pokemonDetails.game_indices.forEach(gameIndex=>{
//             gameList.push(gameIndex.version.name);
//           })
//           // create the pokemon
//           db.pokemon.create({
//             name: pokemonSpecies.name,
//             number: pokemonDetails.id,
//             sprite: pokemonDetails.sprites.other["official-artwork"].front_default,
//             height: pokemonDetails.height,
//             weight: pokemonDetails.weight,
//             hp: pokemonDetails.stats[0].base_stat,
//             attack: pokemonDetails.stats[1].base_stat,
//             defense: pokemonDetails.stats[2].base_stat,
//             specialAttack: pokemonDetails.stats[3].base_stat,
//             specialDefense: pokemonDetails.stats[4].base_stat,
//             speed: pokemonDetails.stats[5].base_stat,
//             title,
//             flavorText
//           })
//           .then(newPokemon=>{
//             // add the pokemon's types
//             db.type.findAll({where:{name:typeList}})
//             .then(types=>{types.forEach(type=>{newPokemon.addType(type)})})
//             // add the pokemon's moves
//             db.move.findAll({where:{name:moveList}})
//             .then(moves=>{moves.forEach(move=>{newPokemon.addMove(move)})})
//             // add the pokemon's games
//             db.game.findAll({where:{name:gameList}})
//             .then(games=>{games.forEach(game=>{newPokemon.addGame(game)})})
//           })
//         })
//       })
//     })
//     if(response.data.next){createInBatches(response.data.next)}
//   })
// }


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
    fetchPokemonData();
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('pokemons', null, {});
  }
};
