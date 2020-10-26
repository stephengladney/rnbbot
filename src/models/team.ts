import { Model, DataTypes } from "sequelize"
import sequelize from "../config/sequelize"

interface TeamProps {
  id: number
  name: string
  slackChannel: string
}

class Team extends Model {
  static createNew = createNew
  static findByName = findByName
}

async function createNew({ name, slackChannel }: Omit<TeamProps, "id">) {
  return Team.create({
    name: name,
    slack_channel: slackChannel,
  })
}

async function findByName({ name }: Pick<TeamProps, "name">) {
  return Team.findOne({
    where: { name },
  })
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
