const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(bodyParser.json());
const posts = {};
// const comments = {};
app.use(cors());
app.get("/post/:id", (req, res) => {
  const post = posts[req.params.id] || [];
  console.log(post);
  res.status(200).json(post);
});

app.post("/events", (req, res) => {
  console.log(req.body);
  const { type, data } = req.body;

  if (type === "PostCreated") {
    const { id, title, status } = data;
    posts[id] = {
      id,
      title,
      comments: [],
      status,
    };
    console.log(posts[id]);
  }
  if (type === "CommentCreated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    post.comments.push({
      id,
      content,
      status,
    });
    console.log(post);
  }

  if (type === "CommentUpdated") {
    const { id, postId, status } = data;
    const post = posts[postId];
    const comment = post.comments.find((comment) => comment.id === id);
    comment.status = status;
  }
  res.status(200).json("");
});

app.listen(4002, () => {
  console.log("app listening to port 4002");
});
