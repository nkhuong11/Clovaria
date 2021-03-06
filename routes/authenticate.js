const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateRegisterInput = require('../services/validation/register');
const validateLoginInput = require('../services/validation/login');

const keys = require('../config/keys');

const User = require('../models/User');

router.post('/register', function(req, res) {
    const { errors, isValid } = validateRegisterInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }
    User.findOne({
        email: req.body.email
    }).exec().then(user => {
        if(user) {
            return res.status(400).json({
                email: 'Email already exists'
            });
        }
        else {
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: 'http://www.gravatar.com/avatar/75d23af433e0cea4c0e45a56dba18b30?s=200&r=pg&d=mm'
            });
            
            bcrypt.genSalt(10, (err, salt) => {
                if(err) console.error('There was an error', err);
                else {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) console.error('There was an error', err);
                        else {
                            newUser.password = hash;
                            newUser
                                .save()
                                .then(user => {
                                    res.json(user)
                                }); 
                        }
                    });
                }
            });
        }
    });
});

router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email})
        .exec()
        .then(user => {
            if(!user) {
                errors.email = 'User not found'
                return res.status(404).json(errors);
            }
            bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        if(isMatch) {
                            const payload = {
                                _id: user.id,
                                username: user.username,
                                email: user.email,
                                avatar: user.avatar,
                                friend_list: user.friend_list
                            }
                            jwt.sign(payload, keys.JWT_SECRET, {
                                expiresIn: 3600
                            }, (err, token) => {
                                if(err) console.error('There is some error in token', err);
                                else {
                                    res.json({
                                        success: true,
                                        token: `Bearer ${token}`
                                    });
                                }
                            });
                        }
                        else {
                            errors.password = 'Incorrect Password';
                            return res.status(400).json(errors);
                        }
                    });
        });
});

router.post('/me', (req, res) => {
    const email = req.body.email;
    User.findOne({email})
        .exec()
        .then(user => {
            if(!user) {
                errors.email = 'User not found'
                return res.status(404).json(errors);
            }   
                        
            const payload = {
                _id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                friend_list: user.friend_list
            }
            jwt.sign(payload, keys.JWT_SECRET, {
                expiresIn: 3600
            }, (err, token) => {
                if(err) console.error('There is some error in token', err);
                else {
                    res.json({
                        success: true,
                        token: `Bearer ${token}`
                    });
                }
            });
        });
});

module.exports = router;