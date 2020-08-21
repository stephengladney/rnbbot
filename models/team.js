const db = require("../config/sequelize")
const Team = db.connection.define(
  "team",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: db.Sequelize.INTEGER,
      unique: true,
    },
    name: {
      allowNull: false,
      type: db.Sequelize.STRING,
      unique: true,
    },
    slack_channel: {
      allowNull: false,
      type: db.Sequelize.STRING,
      unique: true,
    },
  },
  Object.assign({}, db.preferences, {
    hooks: {},
  })
)

module.exports = Team
