import { Model, DataTypes } from "sequelize"
import sequelize from "../config/sequelize"

interface TeamRoleProps {
  teamId: number
  personId: number
  role: string
}

class TeamRole extends Model {
  static createNew = createNew
}

function createNew({ teamId, personId, role }: TeamRoleProps) {
  return TeamRole.create({ team_id: teamId, person_id: personId, role })
}

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
