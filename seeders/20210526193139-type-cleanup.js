'use strict';
const db = require('../models');
// remove the following types
const typesToRemove = ["shadow", "unknown"];

const findAndRemoveTypes = async (typeList) => {
  try{
    for await (const type of typeList) {
      const theType = await db.type.findOne({where:{name:type}});
      await theType.destroy();
    }
  }
  catch{
    console.log('---------ERROR HERE --------');
    console.log(error);
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    findAndRemoveTypes(typesToRemove);
  },

  down: async (queryInterface, Sequelize) => {

  }
};
