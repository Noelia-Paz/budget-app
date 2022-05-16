const { registration, User } = require("../database");
const { check } = require("express-validator");
const { validation } = require("../routes/helper");

const validateId = async (req, res, next) => {
  const data = await registration.findAll({
    where: { id: Number(req.params.dataId) },
  });
  if (data.length > 0) {
    next();
  } else {
    return res.send("The registration does not exist!");
  }
};

const validateUserId = async (req, res, next) => {
  const data = await User.findAll({
    where: { id: req.params.userId },
  });

  if (data.length > 0) {
    next();
  } else {
    return res.send("The user does not exist!");
  }
};

const checkAmount = async (req, res, next) => {
  if (req.body.registrationTypeId === 2) {
    const balance = await registration.findAll({
      where: { registrationTypeId: 3, userId: req.body.userId },
    });
    let currentBalance = balance[0].amount;

    const amount = req.body.amount;

    if (currentBalance < amount) {
      return res.send("The balance is insufficient!");
    }
  }
  next();
};

const updateBalance = async (req, res, next) => {
  const balance = await registration.findAll({
    where: { registrationTypeId: 3, userId: req.body.userId },
  });

  const registrationType = Number(req.body.registrationTypeId);

  let currentBalance = balance[0].amount;

  const amount = Number(req.body.amount);
  if (registrationType === 1) {
    currentBalance = amount + currentBalance;
  } else if (registrationType === 2) {
    currentBalance = currentBalance - amount;
  }

  await registration.update(
    { amount: currentBalance },
    {
      where: { registrationTypeId: 3, userId: req.body.userId },
    }
  );
  next();
};

const validateDataUser = [
  check("username", "Username is required!").not().isEmpty(),
  check("email", "Email is required!").not().isEmpty().isEmail(),
  check("password", "The password is required!").not().isEmpty(),
  (req, res, next) => {
    validation(req, res, next);
  },
];

const validateData = [
  check("concept", "The concept cannot be empty, and must be letters")
    .exists()
    .not()
    .isEmpty()
    .isString(),
  check("amount", "The amount cannot be empty, and must be numbers")
    .exists()
    .not()
    .isEmpty()
    .isNumeric(),
  check("registrationTypeId", "The type cannot be empty, and must be letters")
    .exists()
    .not()
    .isEmpty()
    .isNumeric(),
  check("date", "The date cannot be empty, and must be letters")
    .exists()
    .not()
    .isEmpty()
    .isString(),
  (req, res, next) => {
    validation(req, res, next);
  },
];

module.exports = {
  checkAmount,
  validateId,
  validateData,
  updateBalance,
  validateDataUser,
  validateUserId,
};
