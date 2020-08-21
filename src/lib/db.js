exports.exports.createTeam = ({ name, slackChannel }) =>
  (exports.createTeamRole = ({ teamId, personId, role }) =>
    db.TeamRole.create({ team_id: teamId, person_id: personId, role }))

exports.findPersonByFirstAndLastName = (first, last) =>
  db.Person.findOne({
    where: {
      first_name: first,
      last_name: last,
    },
  })

exports.findPersonByTeamAndRole = async ({ teamName, roleName }) => {
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

exports.findTeamByName = name =>
  db.Team.findOne({
    where: {
      name,
    },
  })