const Sequelize = require("sequelize")
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  freezeTableName: true,
  logging: false,
  define: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
})

export default sequelize
