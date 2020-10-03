const express = require("express");

const app = express();

app.use(express.json());

app.get("/ping", (req, res, next) => {
  res.json({ ping: "pong" });
});

app.listen(3000, () => {
  console.log("app started");
});
