const router = require("express").Router();

const { registration } = require("../database");
const { validateId, validateData } = require("../routes/middlewares");

router.get("/", async (req, res) => {
  const Data = await registration.findAll();
  res.json(Data);
});

router.get("/:dataId", validateId, async (req, res) => {
  const Data = await registration.findAll({
    where: { id: req.params.dataId },
  });
  res.json(Data);
});

router.post("/", validateData, async (req, res) => {
  const Data = await registration.create(req.body);
  res.json(Data);
});

router.put("/:dataId", validateId, async (req, res) => {
  await registration.update(req.body, {
    where: { id: req.params.dataId },
  });
  res.json({ success: "It has been modified successfully!" });
});

router.delete("/:dataId", validateId, async (req, res) => {
  await registration.destroy({
    where: { id: req.params.dataId },
  });
  res.json({ success: "It has been removed successfully!" });
});

module.exports = router;
