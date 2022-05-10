module.exports = (sequelize, type) => {
  return sequelize.define(
    "registration",
    {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      concept: type.STRING,
      amount: type.INTEGER,
      registrationTypeId: type.INTEGER,
      categoryId: type.INTEGER,
      userId: type.INTEGER,
    },
    { freezeTableName: true, timestamps: true }
  );
};
