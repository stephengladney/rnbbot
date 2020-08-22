class TeamRole extends Model {
  static create = create
}

function create({ teamId, personId, role }) {
  return db.TeamRole.create({ team_id: teamId, person_id: personId, role })
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
  { sequelize, modelName: "team" }
)

export default TeamRole
