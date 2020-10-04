const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { ImageModel } = require("../model/model");

const router = express.Router();

router.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  async (req, res, next) => {
    res.statusCode = 201;
    res.json({
      message: "Signup successful",
    });
  }
);

router.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        const error = new Error("An error occurred.");

        return next(error);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const body = { _id: user._id, username: user.username };
        const token = jwt.sign({ user: body }, process.env.SECRET);

        return res.json({ token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

router.post("/post", async (req, res, next) => {
  res.statusCode = 201;

  return res.json(
    await ImageModel.create({
      url: req.query.url,
      label: req.query.label,
    })
  );
});

module.exports = router;