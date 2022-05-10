module.exports = (sequelize, type) => {
  return sequelize.define(
    "registrationType",
    {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      type: type.STRING,
    },
    { freezeTableName: true, timestamps: true }
  );
};
