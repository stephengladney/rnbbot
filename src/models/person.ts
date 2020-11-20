import { DataTypes } from "sequelize"
import sequelize from "../config/sequelize"
import TeamRole from "./team_role"
import { Model, Column, Table } from "sequelize-typescript"

export interface PersonProps {
  first_name: string
  last_name: string
  email_address: string
  slack_handle: string
  slack_id: string
}

@Table
class Person extends Model<Person> {
  static findByFirstAndLastName = findByFirstAndLastName
  static findByTeamIdAndRole = findByTeamIdAndRole

  @Column
  first_name: string

  @Column
  last_name: string
}

function findByFirstAndLastName(first: string, last: string) {
  return Person.findOne({
    where: {
      first_name: first,
      last_name: last,
    },
  })
}

async function findByTeamIdAndRole({
  teamId,
  roleName,
}: {
  teamId: string
  roleName: string
}) {
  try {
    //@ts-ignore
    const matches: TeamRole[] = await TeamRole.findAll({
      where: {
        team_id: teamId,
        role: roleName,
      },
    })

    const matchingPersons = matches.map(async match => {
      const matchingPerson = await Person.findOne({
        where: {
          // TODO: figure out why it doesn't work
          // @ts-ignore
          id: match.person_id,
        },
      })
      return matchingPerson
    })

    return matchingPersons.filter(matchingPerson => !!matchingPerson)
  } catch (err) {
    throw err
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
  { sequelize, modelName: "person" }
)

export default Person
