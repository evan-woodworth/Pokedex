'use strict';
const db = require('../models');
// remove the following games
const gamesToRemove = ["xd", "colosseum"];

const findAndRemoveGames = async (gameList) => {
  try{
    for await (const game of gameList) {
      const theGame = await db.game.findOne({where:{name:game}});
      await theGame.destroy();
    }
  }
  catch{
    console.log('---------ERROR HERE --------');
    console.log(error);
  }
}
const populateMissingTitles = async () => {
  const theGames = await db.game.findAll();
  for await (const game of theGames) {
    if (!game.title) {
      let newTitle = game.name;
      newTitle = newTitle.slice(0,1).toUpperCase().concat(newTitle.slice(1,newTitle.length))
      game.title = newTitle;
      game.save()
    }
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    findAndRemoveGames(gamesToRemove);
    populateMissingTitles();
  },

  down: async (queryInterface, Sequelize) => {

  }
};
