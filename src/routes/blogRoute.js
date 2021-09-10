const { Router } = require("express");
const { isValidObjectId } = require("mongoose");
const { Blog } = require("../models/Blog");
const { User } = require("../models/User");
const { commentRouter } = require("./commentRoute");
const blogRouter = Router();

blogRouter.use("/:blogId/comment", commentRouter);

blogRouter.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find({});
    return res.send({ blogs });
  } catch (err) {
    console.log({ err });
    res.status(500).send({ err: err.message });
  }
});

blogRouter.get("/:blogId", async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!isValidObjectId(blogId))
      return res.status(400).send({ err: "blogId is invalid" });

    const blog = await Blog.findOne({ _id: blogId });
    return res.send({ blog });
  } catch (err) {
    console.log({ err });
    res.status(500).send({ err: err.message });
  }
});

blogRouter.post("/", async (req, res) => {
  try {
    const { title, content, islive, userId } = req.body;
    if (typeof title !== "string")
      return res.status(400).send({ err: "title is required" });
    if (typeof content !== "string")
      return res.status(400).send({ err: "content is required" });
    if (islive && typeof islive !== "boolean")
      return res.status(400).send({ err: "islive must be a boolean" });
    if (!isValidObjectId(userId))
      return res.status(400).send({ err: "userId is invalid" });

    const user = await User.findById(userId); // 없으면 null return
    if (!user) return res.status(400).send({ err: "user does not exist" });

    const blog = new Blog({
      ...req.body,
      user, // 이렇게 user를 넣어주면 mongoose에서 ref를 통해서 ObjectId만 db에 넣어줌
    });
    await blog.save();
    return res.send({ blog });
  } catch (err) {
    console.log({ err });
    return res.status(500).send({ err: err.message });
  }
});

// 전체적인 것을 수정할 때 사용
blogRouter.put("/:blogId", async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!isValidObjectId(blogId))
      return res.status(400).send({ err: "blogId is invalid" });

    const { title, content } = req.body;
    if (typeof title !== "string")
      return res.status(400).send({ err: "title is required" });
    if (typeof content !== "string")
      return res.status(400).send({ err: "content is required" });

    const blog = await Blog.findOneAndUpdate(
      { _id: blogId },
      { title, content },
      { new: true }
    );

    return res.send({ blog });
  } catch (err) {
    console.log({ err });
    res.status(500).send({ err: err.message });
  }
});

// 부분적인 것을 수정할 때 사용 (여기서는 islive를 true로 바꿔주는 역할)
blogRouter.patch("/:blogId/live", async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!isValidObjectId(blogId))
      return res.status(400).send({ err: "blogId is invalid" });

    const { islive } = req.body;
    if (typeof islive !== "boolean")
      return res.status(400).send({ err: "boolean islive is required" });

    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { islive },
      { new: true }
    );
    return res.send({ blog });
  } catch (err) {
    console.log({ err });
    res.status(500).send({ err: err.message });
  }
});

module.exports = {
  blogRouter,
};
