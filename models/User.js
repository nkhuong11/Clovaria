const mongoose = require('mongoose');
const { Schema, ItemSchema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
      type: String,
      required: true,
      unique : true
  },
  password: {
      type: String,
      required: true
  },
  avatar: {
      type: String
  },
  created_date: {
      type: Date,
      default: Date.now
  },
  posts: [{type: Schema.Types.ObjectId, ref: 'Post'}],
  shared_posts: [{type: Schema.Types.ObjectId, ref: 'Post'}],

  friend_list: [],

});

const User = mongoose.model('users', UserSchema);

module.exports = User;
