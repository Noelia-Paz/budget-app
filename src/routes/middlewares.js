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
  check("type", "The type cannot be empty, and must be letters")
    .exists()
    .not()
    .isEmpty()
    .isString(),
  check("date", "The date cannot be empty").exists().not().isEmpty().isDate(),
  (req, res, next) => {
    validation(req, res, next);
  },
];

module.exports = {
  validateId,
  validateData,
};
