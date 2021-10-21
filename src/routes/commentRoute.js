const { Router } = require("express");
const { isValidObjectId, startSession } = require("mongoose");
const { Comment, Blog, User } = require("../models");
const commentRouter = Router({ mergeParams: true }); // blog가 부모인데 blogId까지 params로 받아올 수 있음

commentRouter.get("/", async (req, res) => {
  let { page = 0 } = req.query;
  page = parseInt(page);
  const { blogId } = req.params;

  if (!isValidObjectId(blogId))
    return res.status(400).send({ error: "blogId is invalid" });
  const comments = await Comment.find({ blog: blogId })
    .sort({ createdAt: -1 })
    .skip(page * 3)
    .limit(3);
  return res.send({ comments });
});

commentRouter.post("/", async (req, res) => {
  // const session = await startSession();
  let comment;
  try {
    // await session.withTransaction(async () => {
    const { blogId } = req.params;

    const { content, userId } = req.body;

    if (!isValidObjectId(blogId))
      return res.status(400).send({ error: "blogId is invalid" });
    if (!isValidObjectId(userId))
      return res.status(400).send({ error: "userId is invalid" });
    if (typeof content !== "string")
      return res.status(400).send({ err: "content is required" });

    const [blog, user] = await Promise.all([
      Blog.findById(blogId, {}, {}),
      User.findById(userId, {}, {}),
    ]);

    if (!blog || !user)
      return res.status(400).send({ err: "blog or user does not exist" });
    if (!blog.islive)
      return res.status(400).send({ err: "blog is not available" });
    comment = new Comment({
      content,
      user,
      userFullName: `${user.name.first} ${user.name.last}`,
      blog: blogId,
    });
    // await session.abortTransaction(); // transaction 안에서 일어난 모든 데이터 작업들이 원복됨.
    // await Promise.all([
    //   comment.save(),
    //   Blog.updateOne({ _id: blogId }, { $push: { comments: comment } }),
    // ]);

    // blog.commentsCount++;
    // blog.comments.push(comment);

    // if (blog.commentsCount > 3) blog.comments.shift();

    // await Promise.all([
    //   comment.save({  }),
    //   blog.save(), // 이미 세션을 통해서 불러왔기 때문에 세션 내장됨 => session 옵션 필요 없다.
    //   // Blog.updateOne({ _id: blogId }, { $inc: { commentsCount: 1 } }),
    // ]);
    // });

    await Promise.all([
      comment.save(),
      Blog.updateOne(
        { _id: blogId },
        {
          $inc: { commentsCount: 1 },
          $push: { comments: { $each: [comment], $slice: -3 } },
        }
      ),
    ]);

    return res.send({ comment });
  } catch (err) {
    return res.status(400).send({ error: err.message });
  } finally {
    // await session.endSession();
  }
});

// content만 수정하기 위해 patch
commentRouter.patch("/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (typeof content !== "string")
    return res.status(400).send({ err: "content is required" });

  const [comment] = await Promise.all([
    Comment.findOneAndUpdate({ _id: commentId }, { content }, { new: true }),
    Blog.updateOne(
      { "comments._id": commentId },
      { "comments.$.content": content } // $: "comments._id": commentId 인 element하나를 선택한 것
    ),
  ]);
  return res.send({ comment });
});

commentRouter.delete("/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const comment = await Comment.findOneAndDelete({ _id: commentId });

  await Blog.updateOne(
    { "comments._id": commentId },
    { $pull: { comments: { _id: commentId } } }
  );

  return res.send({ comment });
});

module.exports = { commentRouter };
