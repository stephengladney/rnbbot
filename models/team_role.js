const db = require("../config/sequelize")
const TeamRole = db.connection.define(
  "team_role",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: db.Sequelize.INTEGER,
      unique: true,
    },
    person_id: {
      type: db.Sequelize.INTEGER,
      unique: false,
      allowNull: false,
    },
    team_id: {
      type: db.Sequelize.INTEGER,
      unique: false,
      allowNull: false,
    },
    role: {
      type: db.Sequelize.STRING,
      unique: false,
      allowNull: false,
    },
  },
  Object.assign({}, db.preferences, {
    hooks: {},
  })
)

module.exports = TeamRole
