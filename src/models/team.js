const { Model, DataTypes } = require("sequelize")
const sequelize = require("../config/sequelize")

class Team extends Model {
  static create = async ({ name, slackChannel }) => {
    try {
      await sequelize.sync()
      return Team.create({
        name: name,
        slack_channel: slackChannel,
      })
    } catch (err) {
      return { error: true, description: err }
    }
  }
}

Team.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    slack_channel: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
  },
  { sequelize, modelName: "team" }
)

module.exports = Team
