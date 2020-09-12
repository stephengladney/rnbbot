import { Model, DataTypes } from "sequelize"
import sequelize from "../config/sequelize"

interface TeamProps {
  name: string
  slackChannel: string
}

async function createNew({ name, slackChannel }: TeamProps) {
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
  static createNew = createNew
  static findT
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

export default Team
