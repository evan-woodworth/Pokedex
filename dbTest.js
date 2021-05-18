const db = require('./models');

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
        damageClass: 'Physical'
    },
    {
        name: 'Slam',
        accuracy: 34,
        power: 23,
        pp: 12,
        damageClass: 'Physical'
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
    const thePokemon = await db.pokemon.findAll({include: [db.type, db.move, db.game]});
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
            console.log(`evolves from: ${unEvolved?unEvolved.name:'nothing'}`)
        });
        pokemon.getEvolvesTo()
        .then(evolved=>{
            for(let i=0; i<evolved.length; i++) {
                console.log(`evolves to: ${evolved[i].name}`)
            } 
        });
    })
}
async function showMoves() {
    const theMoves = await db.move.findAll({include: [db.type, db.pokemon]});
    console.log('the move:');
    theMoves.forEach(move=>{
        console.log(move);
        console.log('types:');
        move.type.forEach(type=>console.log(type));
        console.log('pokemon:');
        move.pokemon.forEach(pokemon=>console.log(pokemon));
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


// showPokemon();
// db.pokemon.findOne({where:{name:'Pikachu'},include:[db.type]})
// .then(pokemon=>{
//     pokemon.types.forEach(type=>console.log(type.name))
// })

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