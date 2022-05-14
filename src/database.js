const Sequelize = require("sequelize");
const RegistrationModel = require("./models/registration");
const UserModel = require("./models/user");
const RegistrationTypeModel = require("./models/registrationType");
const CategoryModel = require("./models/category");

const sequelize = new Sequelize("app-presupuesto", "root", "123456", {
  host: "localhost",
  dialect: "mysql",
});

const registration = RegistrationModel(sequelize, Sequelize);
const User = UserModel(sequelize, Sequelize);
const registrationType = RegistrationTypeModel(sequelize, Sequelize);
const Category = CategoryModel(sequelize, Sequelize);

sequelize.sync({ force: false }).then(() => {
  console.log("synchronized tables");
});

module.exports = {
  registration,
  User,
  registrationType,
  Category,
};
