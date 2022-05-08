const Sequelize = require("sequelize");

const RegistrationModel = require("./models/registration");

const sequelize = new Sequelize("app-presupuesto", "root", "123456", {
  host: "localhost",
  dialect: "mysql",
});

const registration = RegistrationModel(sequelize, Sequelize);

sequelize.sync({ force: false }).then(() => {
  console.log("synchronized tables");
});

module.exports = {
  registration,
};
