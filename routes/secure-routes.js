const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const UserModel = require("../model/model");

router.get("/profile", (req, res, next) => {
  res.json({
    user: req.user,
  });
});

router.post("/post", async (req, res, next) => {
  res.statusCode = 201;

  return (
    await UserModel.updateOne({
      $push: {
        images: { url: req.query.url, label: req.query.label, uuid: uuid.v1() },
      },
    }),
    res.json({ success: true })
  );
});

router.delete("/post", async (req, res, next) => {
  await UserModel.findOneAndUpdate(
    { _id: req.user._id },
    { $pull: { images: { uuid: req.body.uuid } } }
  );

  res.status(202).json({ success: true });
});

module.exports = router;
