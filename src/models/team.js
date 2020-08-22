const { Model, DataTypes } = require("sequelize")
const sequelize = require("../config/sequelize")

async function create({ name, slackChannel }) {
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

class Team extends Model {
  static create = create
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
