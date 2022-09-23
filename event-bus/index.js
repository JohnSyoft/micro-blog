const express = require("express");
const bodyParser = require("body-parser");
const { default: axios } = require("axios");
const { json } = require("express");

const app = express();
app.use(bodyParser.json());
app.post("/events", (req, res) => {
  const event = req.body;
  try {
    axios.post("http://localhost:4000/events", event);
  } catch (err) {
    console.log(err);
  }
  try {
    axios.post("http://localhost:4001/events", event);
  } catch (err) {
    console.log(err);
  }
  axios
    .post("http://localhost:4002/events", event)
    .catch((err) => console.log(err.message));

  axios.post("http://localhost:4003/events", event).catch((err) => {
    console.log(err.message);
  });

  res.status(200).json({});
});
app.listen(4005, () => {
  console.log("app listening at port 4005");
});
