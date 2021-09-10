const { Router } = require("express");
const { Comment } = require("../models/Comment");
const commentRouter = Router({ mergeParams: true }); // blog가 부모인데 blogId까지 params로 받아올 수 있음

commentRouter.get("/:commentId", async (req, res) => {
  return res.send(req.params);
});

commentRouter.post("/", async (req, res) => {});

module.exports = { commentRouter };
