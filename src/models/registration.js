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
      type: type.STRING,
      date: type.DATE,
      balance: type.INTEGER,
    },
    { freezeTableName: true, timestamps: true }
  );
};
