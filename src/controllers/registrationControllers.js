const router = require("express").Router();
const {
  registration,
  registrationType,
  Category,
  User,
} = require("../database");
const {
  validateId,
  validateUserId,
  validateData,
  updateBalance,
  checkAmount,
} = require("../routes/middlewares");

router.get("/", async (req, res) => {
  const data = await registration.findAll();
  res.json(data);
});

router.get("/:dataId", validateId, async (req, res) => {
  const data = await registration.findAll({
    where: { id: req.params.dataId },
  });
  res.json(data);
});

router.get("/username/:userId", async (req, res) => {
  const data = await User.findAll({
    where: { id: req.params.userId },
  });
  res.json(data[0].username);
});

router.get("/userId/:userId", validateUserId, async (req, res) => {
  const data = await registration.findAll({
    where: { userId: req.params.userId },
  });

  registrations = data.filter(function (obj) {
    return obj.registrationTypeId !== 3;
  });

  let lastRegistrations = registrations.slice(
    Math.max(registrations.length - 10, 0)
  );

  const registrationsEdited = await lastRegistrations.map(
    async (registration, key) => {
      const registrationTypeName = await registrationType.findAll({
        where: { id: registration.registrationTypeId },
        attributes: ["type"],
        raw: true,
      });

      const categoryTypeName = await Category.findAll({
        where: { id: registration.categoryId },
        attributes: ["category"],
        raw: true,
      });

      const typeName = registrationTypeName[0].type;
      const categoryName = categoryTypeName[0]?.category;

      lastRegistrations[key].dataValues.registrationTypeId = typeName;
      lastRegistrations[key].dataValues.categoryId = categoryName;
    }
  );

  Promise.all(registrationsEdited).then(() => {
    res.json(lastRegistrations);
  });
});

router.get("/income/:userId", validateUserId, async (req, res) => {
  const data = await registration.findAll({
    where: { userId: req.params.userId, registrationTypeId: 1 },
  });

  res.json(data);
});

router.get("/outcome/:userId", validateUserId, async (req, res) => {
  const outcomeRegistrations = await registration.findAll({
    where: { userId: req.params.userId, registrationTypeId: 2 },
  });

  const registrationsEdited = await outcomeRegistrations.map(
    async (registration, key) => {
      const categoryTypeName = await Category.findAll({
        where: { id: registration.categoryId },
        attributes: ["category"],
        raw: true,
      });

      const categoryName = categoryTypeName[0]?.category;

      outcomeRegistrations[key].dataValues.categoryId = categoryName;
    }
  );

  Promise.all(registrationsEdited).then(() => {
    res.json(outcomeRegistrations);
  });
});

router.get("/balance/:userId", validateUserId, async (req, res) => {
  const data = await registration.findAll({
    where: { userId: req.params.userId, registrationTypeId: 3 },
  });

  if (data.length > 0) {
    res.json(data);
  } else {
    return res.send("The user does not have a balance!");
  }
});

router.post("/", validateData, checkAmount, updateBalance, async (req, res) => {
  const data = await registration.create(req.body);
  res.json(data);
});

router.put("/:dataId", validateId, async (req, res) => {
  const data = await registration.findAll({
    where: { id: req.params.dataId },
  });

  const balance = await registration.findAll({
    where: { registrationTypeId: 3, userId: data[0].userId },
  });

  const registrationType = data[0].registrationTypeId;

  let currentBalance = balance[0].amount;

  const amount = req.body.amount;

  if (data[0].amount !== amount) {
    if (registrationType === 1) {
      currentBalance = currentBalance + (amount - data[0].amount);
    } else if (registrationType === 2) {
      currentBalance = currentBalance + (data[0].amount - amount);
    }
  }

  await registration.update(
    { amount: currentBalance },
    {
      where: { registrationTypeId: 3, userId: data[0].userId },
    }
  );

  await registration.update(req.body, {
    where: { id: req.params.dataId },
  });

  res.json({ success: "It has been modified successfully!" });
});

router.delete("/:dataId", validateId, async (req, res) => {
  const data = await registration.findAll({
    where: { id: Number(req.params.dataId) },
  });

  const balance = await registration.findAll({
    where: { registrationTypeId: 3, userId: data[0].userId },
  });

  const registrationType = data[0].registrationTypeId;

  let currentBalance = balance[0].amount;

  const amount = data[0].amount;

  if (data === true) {
    next();
  } else if (registrationType === 1) {
    currentBalance = currentBalance - amount;
  } else if (registrationType === 2) {
    currentBalance = currentBalance + amount;
  }

  await registration.update(
    { amount: currentBalance },
    {
      where: { registrationTypeId: 3, userId: data[0].userId },
    }
  );
  await registration.destroy({
    where: { id: req.params.dataId },
  });
  res.json({ success: "It has been removed successfully!" });
});

module.exports = router;
