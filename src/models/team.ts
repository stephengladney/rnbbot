import { DataTypes } from "sequelize"
import {
  Model,
  Column,
  Table,
  AutoIncrement,
  AllowNull,
} from "sequelize-typescript"
import sequelize from "../config/sequelize"

interface TeamProps {
  id: number
  name: string
  slackChannel: string
}

@Table
class Team extends Model<Team> {
  static findByName = findByName

  @Column
  name: string
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
  { freezeTableName: true,sequelize, modelName: "team" }
)

export default Team
