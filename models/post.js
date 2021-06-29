const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  }, // user
  userName: String,
  userAvatar: String,
  text: {
    type: String,
    required: true,
  },
  date: {
      type: Date,
      default: Date.now()
  }, // date
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    },
  ], // likes
  comments: [
      {
          user: {
              type: Schema.Types.ObjectId,
              ref: 'user'
          },
          text: {
              type: String,
              required: true
          }, // text
          date: {
              type: Date,
              default: Date.now()
          } // date
      }
  ] // comments
});

module.exports = Post = mongoose.model("post", PostSchema);
