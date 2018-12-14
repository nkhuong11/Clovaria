const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../models/User');

//router.post('/addfriend', passport.authenticate('jwt', { session: false }), function(req, res) {
router.post('/addfriend', (req, res) => {
    const {user1_id, user2_id} = req.body   
    User.findOne({
        _id: user1_id
    }).exec().then(user => {
        if(user.friend_list.includes(user2_id)) {
            return res.json({
                success: false,
                message: 'Already added friend'
            });
        }
        else {
            user.friend_list.push(user2_id);
            user.save();
            User.findOne({
                _id: user2_id
            }).exec().then(user2 => {
                user2.friend_list.push(user1_id);
                user2.save();
                return res.status(200).json({
                    success: true,
                    message: 'Added friend succeed'
                })
            })
        }
    });    
});

module.exports = router;