const router = require("express").Router();

const registrationControllers = require("../controllers/registrationControllers");
const userControllers = require("../controllers/userControllers");

router.use("/data", registrationControllers);
router.use("/user", userControllers);

module.exports = router;
