const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const UserModel = require("../model/model");

router.get("/profile", (req, res, next) => {
  res.json({
    user: req.user,
  });
});

router.get("/images", async (req, res, next) => {
  const user = await UserModel.findById(req.user._id);
  res.json({
    images: user.images,
  });
});

router.post("/post", async (req, res, next) => {
  res.statusCode = 201;

  return (
    await UserModel.findByIdAndUpdate(req.user._id, {
      $push: {
        images: { url: req.body.url, label: req.body.label, uuid: uuid.v1() },
      },
    }),
    res.json({ success: true })
  );
});

router.delete("/post", async (req, res, next) => {
  const user = await UserModel.findById(req.user._id);

  bcrypt.compare(req.query.password, user.password, async (err, result) => {
    if (err) {
      res.status(500).json({ success: false, error: err });
    } else if (result) {
      await UserModel.findOneAndUpdate(
        { _id: req.user._id },
        { $pull: { images: { uuid: req.body.uuid } } }
      );

      res.status(202).json({ success: true });
    } else {
      res.status(401).json({ success: false });
    }
  });
});

module.exports = router;
