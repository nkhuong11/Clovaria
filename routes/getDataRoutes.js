const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');

const keys = require('../config/keys');

const User = require('../models/User');

//get all user
//router.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
router.get('/users', (req, res) => {
    User.find({}).select('-password')
        .exec()
        .then(allUser => {
            if(!allUser) {
                return res.status(404);
            }
            return res.status(200).json({all_users: allUser});
        })
});

router.get('/user/:username', (req, res) => {
    const username = req.params.username;
    User.findOne({username: username}).select('-password')
        .exec()
        .then(user => {
                if(!user) {
                    error = 'User not found'
                    return res.status(404).json(error);
                }   
                            
                const result = {
                    _id: user.id,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar,
                    friend_list: user.friend_list
                }

                res.json({
                    success: true,
                    user: result
                });
        });
});

module.exports = router;