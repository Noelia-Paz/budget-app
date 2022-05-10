module.exports = (sequelize, type) => {
  return sequelize.define(
    "category",
    {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      category: type.STRING,
    },
    { freezeTableName: true, timestamps: true }
  );
};
