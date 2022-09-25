const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const app = express();
const axios = require("axios");
app.use(cors());
app.use(bodyParser.json());
const comment = {};
app.post("/comment/:id", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;
  const commentsByPost = comment[req.params.id] || [];
  commentsByPost.push({ id: commentId, content, status: "pending" });
  comment[req.params.id] = commentsByPost;
  await axios
    .post("http://event-bus-srv:4005/events", {
      type: "CommentCreated",
      data: {
        id: commentId,
        content,
        postId: req.params.id,
        status: "pending",
      },
    })
    .catch((err) => console.log(err));
  res.status(200).json(commentsByPost);
});

app.get("/get/comment/:id", (req, res) => {
  const { id } = req.params;
  const data = comment[req.params.id];
  res.status(200).json(data);
});
app.post("/events", async (req, res) => {
  console.log(req.body);

  const { type, data } = req.body;
  if (type === "CommentModerated") {
    const { id, postId, status, content } = data;
    const wholeComment = comment[postId];
    const commentById = wholeComment.find((comme) => comme.id === id);
    commentById.status = status;
    await axios
      .post("http://event-bus-srv:4005/events", {
        type: "CommentUpdated",
        data: {
          id,
          postId,
          content,
          status: status,
        },
      })
      .catch((err) => console.log(err));
  }
  res.status(200).json("event recived on comment");
});
app.listen(4001, () => {
  console.log("app listening to port 4001");
});
