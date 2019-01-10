const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');

const keys = require('../config/keys');

const User = require('../models/User');
const Post = require('../models/Post');

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

//get friends's posts of this user.
router.get('/posts/:user_id', (req, res) => {
    const id = req.params.user_id;

    function findPost(friend_id){
        return new Promise((resolve, reject) =>
            Post.find({owner: friend_id})
                        .populate({path: 'owner', select: 'username avatar email'})
                        .exec((err, posts) => {
                            err ? reject(err) : resolve(posts)
                        }) 
        );
    }
    
    User.findOne({_id: id}).select('friend_list')
        .exec()
        .then(result => {
            if(!result) {
                return res.status(404);
            } else {
                let friends_id = result['friend_list']; 
                let promise_list = [];
                for(let i = 0; i < friends_id.length; ++i) {
                    promise_list.push(findPost(friends_id[i])); 
                }
                
                Promise.all(promise_list)
                        .then((post) => {
                            post_list = []
                            for(let i = 0; i < post.length; ++i) {
                                post_list = post_list.concat(post[i])
                            }
                            return res.json({
                                success: true,
                                posts: post_list
                            });
                        })
            }
        })

    //     User.findOne({_id: id}).select('friend_list')
    //     .exec()
    //     .then(result => {
    //         if(!result) {
    //             return res.status(404);
    //         } else {
    //             let friends_id = result['friend_list']; 
    //             for(let i = 0; i < friends_id.length; ++i) {
    //                 Post.find({owner: friends_id[i]}).select('-image_url')
    //                     .populate({path: 'owner', select: 'username avatar email'})
    //                     .exec((err, posts) => {
    //                         if (err) console.log(err);
    //                         console.log('POST', posts);
    //                         post_list.push(posts);
    //                     }) 
    //             }
    //         }
    //     })


    // console.log('MY TURN');
    //         return res.json({
    //             success: true,
    //             posts: post_list
    //         });
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