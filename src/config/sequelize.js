const Sequelize = require("sequelize")
const sequelize = new Sequelize(process.env.DATABASE_URL)

const dbPreferences = {
  freezeTableName: true,
  underscored: true,
}

module.exports = sequelize
