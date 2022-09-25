const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(bodyParser.json());
const axios = require("axios");
const posts = {};
// const comments = {};
app.use(cors());
app.get("/post/one", (req, res) => {
  // const post = posts[req.params.id] || [];
  console.log(posts);
  res.status(200).json(posts);
});
function handleEvent(type, data) {
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
}

app.post("/events", (req, res) => {
  console.log(req.body);
  const { type, data } = req.body;
  handleEvent(type, data);
  res.status(200).json("");
});

app.listen(4002, async () => {
  console.log("app listening to port 4002");
  const res = await axios
    .get("http://event-bus-srv:4005/events")
    .catch((err) => console.log(err));
  console.log(res.data);
  for (i in res) {
    handleEvent(i.type, i.data);
  }
});
