const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');

const keys = require('../config/keys');

const User = require('../models/User');

//get all user
router.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
//router.get('/users', (req, res) => {
    User.find({}).select('-password')
        .exec()
        .then(allUser => {
            if(!allUser) {
                return res.status(404);
            }
            return res.status(200).json({all_users: allUser});
        })
});

module.exports = router;