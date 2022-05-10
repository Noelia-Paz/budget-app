const { registration } = require("../database");
const { check } = require("express-validator");
const { validation } = require("../routes/helper");

const validateId = async (req, res, next) => {
  const Data = await registration.findAll({
    where: { id: Number(req.params.dataId) },
  });
  if (Data.length > 0) {
    next();
  } else {
    return res.send("The registration does not exist!");
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

  const registrationType = req.body.registrationTypeId;

  let currentBalance = balance[0].amount;

  const amount = req.body.amount;

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
  (req, res, next) => {
    validation(req, res, next);
  },
];

module.exports = {
  checkAmount,
  validateId,
  validateData,
  updateBalance,
};
