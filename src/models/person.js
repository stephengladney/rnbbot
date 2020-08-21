const { Model, DataTypes } = require("sequelize")
const sequelize = require("../config/sequelize")

class Person extends Model {
  static createPerson = async ({
    firstName,
    lastName,
    emailAddress,
    slackHandle,
    slackId,
  }) => {
    try {
      await sequelize.sync()
      return Person.create({
        first_name: firstName,
        last_name: lastName,
        email_address: emailAddress,
        slack_handle: slackHandle,
        slack_id: slackId,
      })
    } catch (err) {
      return { error: true, description: err }
    }
  }
}

Person.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    first_name: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
    },
    email_address: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    slack_handle: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    slack_id: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  },
  { sequelize, modelName: "person" }
)

module.exports = Person
