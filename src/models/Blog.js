const { Schema, model, Types } = require("mongoose");

const BlogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    islive: {
      type: Boolean,
      required: true,
      default: false,
    },
    user: {
      type: Types.ObjectId,
      required: true,
      ref: "user", // User.js에서 model('user') 에 써준 컬렉션 이름
    },
  },
  {
    timestamps: true,
  }
);

const Blog = model("blog", BlogSchema);

module.exports = { Blog };
