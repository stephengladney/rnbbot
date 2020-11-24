import { DataTypes } from "sequelize"
import { Model, Table } from "sequelize-typescript"
import sequelize from "../config/sequelize"

interface TeamRoleProps {
  id: number
  team_id: number
  person_id: number
  role: "design" | "engineer" | "product" | "qa"
}

@Table
class TeamRole extends Model<TeamRoleProps> {}

TeamRole.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    person_id: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false,
    },
    team_id: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
    },
  },
  { sequelize, modelName: "team_role" }
)

export default TeamRole
