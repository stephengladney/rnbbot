import { Model, DataTypes } from "sequelize"
import sequelize from "../config/sequelize"
import TeamRole from "./team_role"

export interface PersonProps {
  firstName: string
  lastName: string
  emailAddress: string
  slackHandle: string
  slackId: string
}

class Person extends Model {
  static createNew = createNew
  static findByFirstAndLastName = findByFirstAndLastName
  static findByTeamAndRole = findByTeamAndRole
}

async function createNew({
  firstName,
  lastName,
  emailAddress,
  slackHandle,
  slackId,
}: PersonProps) {
  try {
    // await sequelize.sync()
    return Person.create({
      first_name: firstName,
      last_name: lastName,
      email_address: emailAddress,
      slack_handle: slackHandle,
      slack_id: slackId,
    })
  } catch (err) {
    throw err
  }
}

function findByFirstAndLastName(first: string, last: string) {
  return Person.findOne({
    where: {
      first_name: first,
      last_name: last,
    },
  })
}

export async function findByTeamAndRole({
  teamName,
  roleName,
}: {
  teamName: string
  roleName: string
}) {
  try {
    const { id: teamId } = await exports.getTeamByName(teamName)
    const matches: TeamRole[] = await TeamRole.findAll({
      where: {
        team_id: teamId,
        role_name: roleName,
      },
    })
    const matchingPerson = await Person.findOne({
      where: {
        //@ts-ignore
        id: matches[0].person_id,
      },
    })
    return matchingPerson
  } catch (err) {
    return { error: true, message: `${err}` }
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
  { freezeTableName: true, sequelize, modelName: "person" }
)

export default Person
