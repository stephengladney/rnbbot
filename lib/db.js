const pg = require("pg")
const db = require("../models")
const { Op } = require("sequelize")

exports.createPerson = function createUser({
  firstName,
  lastName,
  emailAddress,
  slackHandle,
  slackId,
}) {
  return db.Person.create({
    first_name: firstName,
    last_name: lastName,
    email_address: emailAddress,
    slack_handle: slackHandle,
    slack_id: slackId,
  })
}

exports.getPersonByFirstAndLastName = function getPersonByFirstAndLastName(
  first,
  last
) {
  return db.Person.findOne({
    where: {
      first_name: first,
      last_name: last,
    },
  })
}

exports.getTeamByName = function getTeamByName(name) {
  return db.Team.findOne({
    where: {
      name: name,
    },
  })
}

exports.getPersonByTeamAndRole = async function getPersonByTeamAndRole(
  teamName,
  roleName
) {
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
