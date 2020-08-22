const Sequelize = require("sequelize")
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  freezeTableName: true,
  define: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
})

module.exports = sequelize
