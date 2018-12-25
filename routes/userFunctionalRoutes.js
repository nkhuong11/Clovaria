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

router.post('/unfriend', (req, res) => {
    const {user1_id, user2_id} = req.body   
    User.findOne({
        _id: user1_id
    }).exec().then(user => {
        position = user.friend_list.indexOf(user2_id)
        if(position == -1) {
            return res.json({
                success: false,
                message: 'Not added friend yet'
            });
        }
        else {
            user.friend_list.splice(position, 1)
            user.save();
            User.findOne({
                _id: user2_id
            }).exec().then(user2 => {
                position2 = user2.friend_list.indexOf(user1_id)
                user2.friend_list.splice(position2, 1);
                user2.save();
                return res.status(200).json({
                    success: true,
                    message: 'Unfriended succeed'
                })
            })

           
        }
    });    
});


module.exports = router;