const pg = require("pg")
const db = require("../models")
const { Op } = require("sequelize")

exports.getUserByFirstAndLastName = function getUserByFirstAndLastName(
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

exports.getUserByTeamAndRole = async function getUserByTeamAndRole(
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
    const matchingUser = await db.Person.findOne({
      where: {
        id: matches[0].person_id,
      },
    })
    return matchingUser
  } catch (err) {
    return { error: true, message: `${err}` }
  }
}
