const { Model, DataTypes } = require("sequelize")
const sequelize = require("../config/sequelize")

class Person extends Model {
  static createNew = createNew
  static findPersonByFirstAndLastName = findPersonByFirstAndLastName
  static findPersonByTeamAndRole = findPersonByTeamAndRole
}

async function createNew({
  firstName,
  lastName,
  emailAddress,
  slackHandle,
  slackId,
}) {
  try {
    await sequelize.sync()
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

function findPersonByFirstAndLastName(first, last) {
  return db.Person.findOne({
    where: {
      first_name: first,
      last_name: last,
    },
  })
}

async function findPersonByTeamAndRole({ teamName, roleName }) {
  try {
    const { id: teamId } = await exports.getTeamByName(teamName)
    const matches = await db.TeamRole.findAll({
      where: {
        team_id: teamId,
        role_name: roleName,
      },
    })
    const matchingPerson = await db.Person.findOne({
      where: {
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

module.exports = Person
