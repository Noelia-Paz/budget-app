const { Router } = require("express");
const router = Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv");

const config = require("../config");

const { User, registration } = require("../database");

router.post("/signup", async (req, res, next) => {
  const { username, email, password } = req.body;
  const user = new User({
    username,
    email,
    password,
  });

  await user.save();

  const token = jwt.sign({ id: user.id }, "secret", config.secret, {
    expiresIn: 60 * 60 * 24,
  });

  await registration.create({
    concept: "start",
    amount: 0,
    registrationTypeId: 3,
    userId: user.id,
  });

  res.json({ auth: true, token });
});

router.post("/signin", async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findAll({
    where: { email: email },
  });

  if (!user.length) {
    return res.json({
      status: 404,
      message: "The email does not exist!",
    });
  }

  const validPassword = await bcrypt.compare(password, user[0].password);

  if (!validPassword) {
    return res.json({
      status: 404,
      message: "Password is incorrect!",
    });
  }
});

module.exports = router;
