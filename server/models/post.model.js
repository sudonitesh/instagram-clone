const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  photo: {
    data: Buffer,
    contentType: String
  },
  likes: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  comments: [{
    text: String,
    created: {
      type: Date,
      default: Date.now
    },
    postedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  }],
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = Post = mongoose.model("Post", PostSchema);