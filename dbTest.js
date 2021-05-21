const db = require('./models');
const axios = require('axios');

// test data
const testGames = [
    {name:'red'},
    {name:'blue'}
];
const testTypes = [
    {name:'water'},
    {name:'fire'},
    {name:'grass'},
    {name:'normal'},
    {name:'electric'}
];
const testMoves = [
    {
        name: 'Scratch',
        accuracy: 45,
        power: 54,
        pp: 10,
        description: 'a move of sort'
    },
    {
        name: 'Slam',
        accuracy: 34,
        power: 23,
        pp: 12,
        description: 'yeah whatever'
    }
];
const testPokemon = [
    {
        name: 'Pikachu',
        number: 25,
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
        height: 4,
        weight: 60,
        hp: 35,
        attack: 55,
        defense: 40,
        specialAttack: 50,
        specialDefense: 50,
        speed: 90,
        evolvesFromId: null,
        evolvesToId: null
    },
    {
        name: 'Raichu',
        number: 26,
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/26.png',
        height: 8,
        weight: 300,
        hp: 60,
        attack: 90,
        defense: 55,
        specialAttack: 90,
        specialDefense: 80,
        speed: 110,
        evolvesFromId: null,
        evolvesToId: null
    }
]

// functions to populate tables with test data
async function addGame(game) {
    return await db.game.create(game);
}
async function addType(type) {
    return await db.type.create(type);
}
async function addMove(move) {
    return await db.move.create(move);
}
async function addPokemon(pokemon) {
    return await db.pokemon.create(pokemon);
}

// functions to add associations
async function addTypeToMove(type,move){
    // each parameter is a string referencing name
    const theType = await db.type.findOne({where: {name:type}});
    const theMove = await db.move.findOne({where: {name:move}});
    const linkedMove = await theMove.addType(theType)
    console.log(linkedMove);
}
async function addTypeToPokemon(type,pokemon){
    // each parameter is a string referencing name
    const theType = await db.type.findOne({where: {name:type}});
    const thePokemon = await db.pokemon.findOne({where: {name:pokemon}});
    const linkedPokemon = await thePokemon.addType(theType)
    console.log(linkedPokemon);
}
async function addMoveToPokemon(move,pokemon){
    // each parameter is a string referencing name
    const theMove = await db.move.findOne({where: {name:move}});
    const thePokemon = await db.pokemon.findOne({where: {name:pokemon}});
    const linkedPokemon = await thePokemon.addMove(theMove)
    console.log(linkedPokemon);
}
async function addEvolution(basePokemon,evolvedPokemon) {
    const theBasePokemon = await db.pokemon.findOne({where:{name:basePokemon}});
    const theEvolvedPokemon = await db.pokemon.findOne({where:{name:evolvedPokemon}});
    await theEvolvedPokemon.setEvolvesFrom(theBasePokemon);
    await theBasePokemon.addEvolvesTo(theEvolvedPokemon);  
}
async function addGameToPokemon(game,pokemon){
    // each parameter is a string referencing name
    const theGame = await db.game.findOne({where: {name:game}});
    const thePokemon = await db.pokemon.findOne({where: {name:pokemon}});
    const linkedPokemon = await thePokemon.addGame(theGame)
    console.log(linkedPokemon);
}

// functions to show data
async function showPokemon() {
    const thePokemon = await db.pokemon.findAll({where:{name:'ivysaur'},include: [db.type, db.move, db.game]});
    console.log('the pokemon:');
    thePokemon.forEach(pokemon=>{
        console.log('-----------------');
        console.log(pokemon.name);
        console.log('types:');
        pokemon.types.forEach(type=>console.log(type.name));
        console.log('moves:');
        pokemon.moves.forEach(move=>console.log(move.name));
        console.log('games:');
        pokemon.games.forEach(game=>console.log(game.name));
        console.log('-----------------');
        pokemon.getEvolvesFrom()
        .then(unEvolved=>{
            console.log(`${pokemon.name} evolves from: ${unEvolved?unEvolved.name:'nothing'}`)
        });
        pokemon.getEvolvesTo()
        .then(evolved=>{
            for(let i=0; i<evolved.length; i++) {
                console.log(`${pokemon.name} evolves to: ${evolved[i].name}`)
            } 
        });
    })
}
async function showMoves() {
    const theMoves = await db.move.findAll({include: [db.type, db.pokemon]});
    console.log('the move:');
    theMoves.forEach(move=>{
        console.log('----------')
        console.log(move.name);
        console.log(`Accuracy: ${move.accuracy}`);
        console.log(`Power: ${move.power}`);
        console.log(`pp: ${move.pp}`);
        console.log(`Damage Class: ${move.damageClass}`);
        console.log('types:');
        move.types.forEach(type=>console.log(type.name));
        console.log('pokemon:');
        move.pokemons.forEach(pokemon=>console.log(pokemon.name));
    })
}
async function showTypes() {
    const theTypes = await db.type.findAll();
    console.log('the types:');
    console.log(theTypes);
}
async function showGames() {
    const theGames = await db.game.findAll();
    console.log('the games:');
    console.log(theGames);
}

// ----- DO STUFF ----- //

// testGames.forEach(game=>addGame(game));
// testTypes.forEach(type=>addType(type));
// testMoves.forEach(move=>addMove(move));
// testPokemon.forEach(pokemon=>addPokemon(pokemon));

// addTypeToMove('normal','Scratch');
// addTypeToMove('normal','Slam');
// addTypeToPokemon('electric','Pikachu');
// addTypeToPokemon('electric','Raichu');
// addMoveToPokemon('Scratch','Pikachu');
// addMoveToPokemon('Scratch','Raichu');
// addMoveToPokemon('Slam','Raichu');
// addGameToPokemon('red','Pikachu');
// addGameToPokemon('blue','Pikachu');
// addGameToPokemon('red','Raichu');
// addGameToPokemon('blue','Raichu');
// addEvolution('Pikachu','Raichu');

// axios.get(`http://pokeapi.co/api/v2/type/`)
// .then(response => {
//   theTypes = response.data.results;
//   theTypes.forEach(type=>db.type.create({name:type.name}));
// })
// showTypes();

// axios.get(`http://pokeapi.co/api/v2/version?limit=34`)
// .then(response => {
//   theGames = response.data.results;
// //   theGames.forEach(game=>console.log(game.name))
//   theGames.forEach(game=>db.game.create({name:game.name}));
// })
// showGames();

// axios.get(`http://pokeapi.co/api/v2/move?limit=5`)
// .then(response => {
//   let theMoves = response.data.results;
//   theMoves.forEach(move=>{
//     axios.get(move.url)
//     .then(response=>{
//         let moveDetails = response.data;
//         // console.log('----------');
//         // console.log(move.name);
//         // console.log(`Accuracy: ${moveDetails.accuracy}`);
//         // console.log(`Power: ${moveDetails.power}`);
//         // console.log(`pp: ${moveDetails.pp}`);
//         // console.log(`Damage Class: ${moveDetails.damage_class.name}`);
//         // console.log(`Type: ${moveDetails.type.name}`);
//         db.move.create({
//             name: move.name,
//             accuracy: moveDetails.accuracy,
//             power: moveDetails.power,
//             pp: moveDetails.pp,
//             damageClass: moveDetails.damage_class.name
//         })
//         .then(newMove=>{
//             db.type.findOne({where:{name:moveDetails.type.name}})
//             .then(theType=>{newMove.addType(theType)})
//         })
//     })
//   })
// })
// showMoves();


// axios.get(`http://pokeapi.co/api/v2/pokemon-species?limit=5`)
// .then(response => {
//     let thePokemon = response.data.results;
//     thePokemon.forEach(pokemon=>{
//         axios.get(pokemon.url)
//         .then(response=>{
//             let pokemonSpecies = response.data;
//             axios.get(pokemonSpecies.varieties[0].pokemon.url)
//             .then(results=>{
//                 let pokemonDetails = results.data;
//                 let typeList = [];
//                 let moveList = [];
//                 let gameList = [];
//                 // find the pokemon's type(s)
//                 pokemonDetails.types.forEach(typeCase=>{typeList.push(typeCase.type.name)});
//                 // find the pokemon's moves
//                 pokemonDetails.moves.forEach(moveCase=>{
//                     moveCase.version_group_details.forEach(vgCase=>{
//                         let levelLearned = vgCase.level_learned_at;
//                         let vgMethod = vgCase.move_learn_method.name;
//                         let name = moveCase.move.name;
//                         if( (vgMethod == "level-up") && (moveList.length<4) 
//                             && !(moveList.includes(name)) && (levelLearned === 1) ){
//                             moveList.push(name);
//                         }
//                     });
//                 });
//                 // find the pokemon's games
//                 pokemonDetails.game_indices.forEach(gameIndex=>{
//                     gameList.push(gameIndex.version.name);
//                 })
//                 // create the pokemon
//                 db.pokemon.create({
//                     name: pokemonDetails.name,
//                     number: pokemonDetails.id,
//                     sprite: pokemonDetails.sprites.front_default,
//                     height: pokemonDetails.height,
//                     weight: pokemonDetails.weight,
//                     hp: pokemonDetails.stats[0].base_stat,
//                     attack: pokemonDetails.stats[1].base_stat,
//                     defense: pokemonDetails.stats[2].base_stat,
//                     specialAttack: pokemonDetails.stats[3].base_stat,
//                     specialDefense: pokemonDetails.stats[4].base_stat,
//                     speed: pokemonDetails.stats[5].base_stat
//                 })
//                 .then(newPokemon=>{
//                     // add the pokemon's types
//                     db.type.findAll({where:{name:typeList}})
//                     .then(types=>{types.forEach(type=>{newPokemon.addType(type)})})
//                     // add the pokemon's moves
//                     db.move.findAll({where:{name:moveList}})
//                     .then(moves=>{moves.forEach(move=>{newPokemon.addMove(move)})})
//                     // add the pokemon's games
//                     db.game.findAll({where:{name:gameList}})
//                     .then(games=>{games.forEach(game=>{newPokemon.addGame(game)})})
//                 })
//             })
//         })
//     })
// })
// showPokemon()

// const fetchPokemonData = async () => {
//     const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100');
//     const { results } = response.data;
//     for await (const pokemon of results) {
//         const pokemonResponse = await axios.get(pokemon.url);
//         const pokemonData = pokemonResponse.data;
//         const { name, order, types } = pokemonData;
//         console.log('-->');
//         console.log('------- NAME ----------')
//         console.log(name);
//         console.log('------- TYPES ----------')
//         console.log(types);
//         console.log('-->');
//     }
// }
// fetchPokemonData();

// const fetchEvolutionData = async () => {
//     const response = await axios.get('https://pokeapi.co/api/v2/evolution-chain?limit=467');
//     const { results } = response.data;
//     for await (const chain of results) {
//         const chainResponse = await axios.get(chain.url);
//         const basePokemon = chainResponse.data.chain;
//         console.log('--------------')
//         const getEvolution = (basePokemon, evolutions) => {
//             const baseName = basePokemon.species.name;
//             for (const evolution of evolutions) {
//                 nextPokemonName = evolution.species.name
//                 console.log(`${baseName} evolves to ${nextPokemonName}`)
//                 if(evolution.evolves_to) {
//                     getEvolution(evolution, evolution.evolves_to)
//                 }
//             }
//         }

//         getEvolution(basePokemon, basePokemon.evolves_to)
//     }
// }
// fetchEvolutionData();

// const fetchEvolutionData = async () => {
//     const response = await axios.get('https://pokeapi.co/api/v2/evolution-chain/?limit=467');
//     const { results } = response.data;
//     let theCount = 0;
//     for await (const chain of results) {
//         const chainResponse = await axios.get(chain.url);
//         const basePokemon = chainResponse.data.chain;

//         const getEvolution = async (basePokemon, evolutions) => {
//             const baseForm = await db.pokemon.findOne({where:{name:basePokemon.species.name}});
//             for (const evolution of evolutions) {
//                 const nextForm = await db.pokemon.findOne({where:{name:evolution.species.name}});
//                 console.log(`${baseForm.name} evolves to ${nextForm.name}`)
//                 await nextForm.setEvolvesFrom(baseForm);
//                 await baseForm.addEvolvesTo(nextForm);  
//                 if(evolution.evolves_to) {
//                     getEvolution(evolution, evolution.evolves_to)
//                 }
//             }
//         }
        
//         getEvolution(basePokemon, basePokemon.evolves_to)
//     }

// }
// fetchEvolutionData();
// db.pokemon.findOne({where:{name:'wormadam'}}).then(result=>console.log(result))
// db.pokemon.findAll().then(result=>console.log(result))

const fetchEvolutions = async () => {
    const thePokemon = await db.pokemon.findOne({where:{name:'ivysaur'}});
    const lastForm = await thePokemon.getEvolvesFrom();
    const nextForms = await thePokemon.getEvolvesTo();
    console.log(lastForm.title)
}
fetchEvolutions()

