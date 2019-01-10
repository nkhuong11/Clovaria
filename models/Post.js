const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  image_url: {
    type: String,
    required: true,
  },
  owner: {type: Schema.Types.ObjectId, ref: 'users'},
  created_date: {
    type: Date,
    default: Date.now
  },
  loved_by: [{type: Schema.Types.ObjectId, ref: 'users'}],
  shared_by: [{type: Schema.Types.ObjectId, ref: 'users'}],
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;