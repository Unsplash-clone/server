const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const UserModel = require("../model/model");

router.get("/profile", (req, res, next) => {
  res.json({
    message: "Secure route",
    user: req.user,
    token: req.query.secret_token,
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
