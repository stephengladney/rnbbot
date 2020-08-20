const db = require("../config/sequelize")
const Team = db.connection.define(
  "team",
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: db.Sequelize.INTEGER,
      unique: true,
    },
    name: {
      type: db.Sequelize.STRING,
      unique: true,
      allowNull: false,
    },

    slack_channel: {
      type: db.Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
  },
  Object.assign({}, db.preferences, {
    hooks: {},
  })
)

module.exports = Team
