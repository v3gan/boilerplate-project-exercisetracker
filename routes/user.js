var express = require('express');
var User = require('../models/user');
var Exercise = require('../models/exercise');
require('dotenv').config()

//Set up mongoose connection
var mongoose = require('mongoose');
const { rawListeners } = require('../models/user');
var mongoDB = process.env.MONGO_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var router = express.Router();

router.post('/', (req, res) => {
    const user = new User({
        username: req.body.username
    });
    user.save((err, data) => {
        if(err){
            return res.json({error: `error creating user: ${err}`});
        }
        res.json({username: data.username, _id: data._id});
    });
});

router.post('/:_id/exercises', (req, res) => {
    User.findById(req.params._id, (err, user) => {
        if(err) {
            return res.json({error: `error getting user: ${err}`});
        }
        const exercise = new Exercise({
            user: user,
            description: req.body.description,
            duration: req.body.duration,
            date: req.body.date || Date.now()
        });
        exercise.save((err, data) => {
            if(err) {
                return res.json({error: `error saving exercise: ${err}`});
            }
            res.json({
                _id: data._id,
                username: data.user.username,
                date: data.date,
                duration: data.duration,
                description: data.description
            });    
        });
    });
});

router.get('/:_id/logs', (req, res) => {    
    User.findById(req.params._id, (err, user) => {
        if(err) {
            return res.json({error: `error getting user: ${err}`});
        }
        const from = req.query.from;
        const to = req.query.to;
        const limit = req.query.limit;
        let dateQuery = {};
        const query = Exercise.find({user: user});
        if(from) {
            query.find({date: {$gte: from}})
        }
        if(to) {
            query.find({date: {$lte: to}})
        }        
        if(limit){
            query.limit(limit);
        }    
        query.exec((err, exercises) => {
            if(err) {
                return res.json({error: `error finding exercise: ${err}`});
            }
            const log = {
                username: user.username,
                count: exercises.length,
                _id: user._id,
                log: exercises.map(e => {
                    return {
                        description: e.description, 
                        duration: e.duration, 
                        date: e.date
                    };
                })
            }
            res.json(log);
        });
    });
});

module.exports = router;