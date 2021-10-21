const { Schema, model, Types } = require("mongoose");
const { CommentSchema } = require("./Comment");

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
    // user: new Schema({
    //   // new Scheme: 이렇게 해줘야 const blog = new Blog({ ...req.body, user }); 했을 때 user가 Object로 들어감. 이렇게 안할거면 user.toObject() 로 해야됨 (Mongoose 모듈 버전 6부터)
    //   _id: { type: Types.ObjectId, required: true, ref: "user" }, // User.js에서 model('user') 에 써준 컬렉션 이름
    // }),
    user: {
      _id: { type: Types.ObjectId, required: true, ref: "user" }, // index: true 로 단일 인덱스 설정 가능
      username: { type: String, required: true },
      name: {
        first: {
          type: String,
          required: true,
        },
        last: {
          type: String,
          required: true,
        },
      },
    },
    commentsCount: {
      type: Number,
      default: 0,
      required: true,
    },
    comments: [CommentSchema],
  },
  {
    timestamps: true,
  }
);

BlogSchema.index({ "user._id": 1, updatedAt: 1 }); // 복합키는 무조건 여기서 만들어야됨 (단일 인덱스도 여기서 만들 수 있음), unique: true는 유니크 옵션
BlogSchema.index({ title: "text", content: "text" }); // text index는 컬렉션당 하나만 만들 수 있음 (단어가 정확해야됨), 복합키는 가능

// 가상의 필드 추가 (CommentSchema 의 blog 와 BlogSchema 연결) : DB에는 저장안됨
// BlogSchema.virtual("comments", {
//   ref: "comment",
//   localField: "_id",
//   foreignField: "blog",
// });

// BlogSchema.set("toObject", { virtuals: true });
// BlogSchema.set("toJSON", { virtuals: true });

const Blog = model("blog", BlogSchema);

module.exports = { Blog };
