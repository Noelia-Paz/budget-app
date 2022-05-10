const bcrypt = require("bcryptjs");

module.exports = (sequelize, type) => {
  return sequelize.define(
    "user",
    {
      username: type.STRING,
      email: type.STRING,
      password: type.STRING,
    },
    {
      freezeTableName: true,
      timestamps: true,
      hooks: {
        beforeCreate: (user) => {
          {
            user.password =
              user.password && user.password != ""
                ? bcrypt.hashSync(user.password, 10)
                : "";
          }
        },
      },
    }
  );
};
