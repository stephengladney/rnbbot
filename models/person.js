const db = require("../config/sequelize")
const Person = db.connection.define(
  "person",
  {
    email_address: {
      type: db.Sequelize.STRING,
      unique: true,
      allowNull: false,
    },

    first_name: {
      type: db.Sequelize.STRING,
      unique: true,
      allowNull: false,
    },

    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: db.Sequelize.INTEGER,
      unique: true,
    },

    last_name: {
      type: db.Sequelize.STRING,
      unique: true,
      allowNull: false,
    },

    slack_handle: {
      type: db.Sequelize.STRING,
      unique: true,
      allowNull: false,
    },

    slack_id: {
      type: db.Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
  },
  Object.assign({}, db.preferences, {
    hooks: {},
  })
)

module.exports = Person
