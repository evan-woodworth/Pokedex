const express = require('express');
const router = express.Router();
const passport = require('../config/ppConfig');
const db = require('../models');

router.get('/', async (req,res)=>{
    const allPokemon = await db.pokemon.findAll({include:[db.game,db.type,db.user]});
    allPokemon.sort((a, b) => (a.number > b.number) ? 1 : -1);
    // all of the games
    const theGames = await db.game.findAll();
    // all the types
    const theTypes = await db.type.findAll();
    // sorting
    theGames.sort((a, b) => (a.name > b.name) ? 1 : -1);
    theTypes.sort((a, b) => (a.name > b.name) ? 1 : -1);
    // the user's pokemon
    const theUser = await db.user.findOne({where:{name:req.user.name},include:[db.pokemon]});
    const pokemonList = [];
    theUser.pokemons.forEach(pokemon=>pokemonList.push(pokemon.name));
    // filters off
    let collection = false;
    let theValidGames = ['My Collection']
    theGames.forEach(game=>theValidGames.push(game.name));
    let theValidTypes = []
    theTypes.forEach(type=>theValidTypes.push(type.name));

    res.render('pokemon/index',{allPokemon, theGames, theValidGames, theTypes, theValidTypes, pokemonList, collection})
})

// show user's collection
router.get('/collection', async (req,res)=>{
    // the user's pokemon
    const theUser = await db.user.findOne({where:{name:req.user.name},include:[db.pokemon]});
    const pokemonList = [];
    let theValidGames = ['My Collection'];
    let theValidTypes = [];
    theUser.pokemons.forEach(pokemon=>pokemonList.push(pokemon.name));
    const allPokemon = await db.pokemon.findAll({
        where:{name:pokemonList},
        include:[db.game,db.type,db.user]
    });
    allPokemon.forEach(pokemon=>{
        pokemon.games.forEach(game=>{
            if (theValidGames.indexOf(game.name)<0) {
                theValidGames.push(game.name);
            }
        })
        pokemon.types.forEach(type=>{
            if (theValidTypes.indexOf(type.name)<0) {
                theValidTypes.push(type.name);
            }
        })
    })
    allPokemon.sort((a, b) => (a.number > b.number) ? 1 : -1);
    // all of the games
    const theGames = await db.game.findAll();
    // all the types
    const theTypes = await db.type.findAll();
    // sorting
    theGames.sort((a, b) => (a.name > b.name) ? 1 : -1);
    theTypes.sort((a, b) => (a.name > b.name) ? 1 : -1);
    let collection = true;

    res.render('pokemon/index',{allPokemon, theGames, theValidGames, theTypes, theValidTypes, pokemonList, collection})
})

// filter pokemon
router.get('/filter/:toggle/:value', async (req,res)=>{
    // all of the games
    const theGames = await db.game.findAll();
    // all the types
    const theTypes = await db.type.findAll();
    // sorting
    theGames.sort((a, b) => (a.name > b.name) ? 1 : -1);
    theTypes.sort((a, b) => (a.name > b.name) ? 1 : -1);
    // setting up filters
    let theFilters = {
        theValidGames: [],
        theValidTypes: []
    }
    theGames.forEach(game=>theFilters.theValidGames.push(game.name));
    theTypes.forEach(type=>theFilters.theValidTypes.push(type.name));
    // set filter
    let {toggle, value} = req.params;
    theFilters[toggle] = [value]
    let {theValidGames, theValidTypes} = theFilters;
    const allPokemon = await db.pokemon.findAll({
        include:[
            {model: db.type, where:{name:theValidTypes}},
            {model: db.game, where:{name:theValidGames}},
            db.user
        ]
    })
    allPokemon.sort((a, b) => (a.number > b.number) ? 1 : -1);

    // the user's pokemon
    const theUser = await db.user.findOne({where:{name:req.user.name},include:[db.pokemon]});
    const pokemonList = [];
    theUser.pokemons.forEach(pokemon=>pokemonList.push(pokemon.name));
    let collection = false;
    
    res.render('pokemon/index',{allPokemon, theGames, theValidGames, theTypes, theValidTypes, pokemonList, collection})
})

router.get('/:id', async (req,res)=>{
    const thePokemon = await db.pokemon.findOne({
        where:{number:req.params.id},
        include:[db.type,db.move,db.game,db.user]
    });
    const theUser = await db.user.findOne({where:{name:req.user.name},include:[db.pokemon]});
    const pokemonList = [];
    theUser.pokemons.forEach(pokemon=>pokemonList.push(pokemon.name));

    collectionStatus = pokemonList.includes(thePokemon.name);
    const lastForm = await thePokemon.getEvolvesFrom();
    const nextForms = await thePokemon.getEvolvesTo();
    const theGames = await db.game.findAll();
    theGames.sort((a, b) => (a.name > b.name) ? 1 : -1);
    res.render('pokemon/show',{thePokemon, theGames, lastForm, nextForms, collectionStatus})
})

// POST
router.post('/', async (req,res)=>{
    const {pokemonName} = req.body;
    const theUser = await db.user.findOne({where:{id:req.user.id}});
    const thePokemon = await db.pokemon.findOne({where:{name:pokemonName}});
    theUser.addPokemons(thePokemon);
    res.redirect('/pokemon');
})

// DELETE
router.delete('/', async (req,res)=>{
    const {pokemonName} = req.body;
    const theUser = await db.user.findOne({where:{id:req.user.id}});
    const thePokemon = await db.pokemon.findOne({where:{name:pokemonName}});
    theUser.removePokemons(thePokemon);
    res.redirect('/pokemon');
})

// PUT
router.put('/', async (req,res)=>{
    const {sprite} = req.body;
    const theUser = await db.user.findOne({where:{id:req.user.id}});
    console.log('-----------------');
    console.log(theUser.name);
    console.log(sprite)
    theUser.profilePicture = sprite;
    await theUser.save();
    res.redirect('/pokemon');
})

module.exports = router;