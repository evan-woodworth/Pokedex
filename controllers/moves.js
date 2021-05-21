const express = require('express');
const router = express.Router();
const passport = require('../config/ppConfig');
const db = require('../models');

router.get('/', async (req,res)=>{
    const allMoves = await db.move.findAll();
    allMoves.sort();
    
    res.render('moves/index',{allMoves})
})
router.get('/:id', async (req,res)=>{
    const theMove = await db.move.findOne({where:{name:req.params.id}});
    res.render('moves/show',{theMove})
})

module.exports = router;