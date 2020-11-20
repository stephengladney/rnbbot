import { Model, DataTypes } from "sequelize"
import sequelize from "../config/sequelize"

class Configuration extends Model {
  static findByTeamId = findByTeamId
}

async function findByTeamId({ teamId }: { teamId: number }) {
  try {
    return Configuration.findOne({
      where: { team_id: teamId },
    })
  } catch (err) {
    return { error: true, description: err }
  }
}

Configuration.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    team_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      unique: true,
    },
    slack_days: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: false,
    },
    slack_start_hour: {
      allowNull: false,
      type: DataTypes.INTEGER,
      unique: false,
    },
    slack_stop_hour: {
      allowNull: false,
      type: DataTypes.INTEGER,
      unique: false,
    },
    unassigned_method: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: false,
    },
    unassigned_notify_on_entry: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: false,
    },
    unassigned_monitor_for_stagnants: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: false,
    },
  },
  { sequelize, modelName: "configuration" }
)

export default Configuration
