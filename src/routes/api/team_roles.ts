import { createRoutes } from "./handlers"
import Person from "../../models/person"
import Team from "../../models/team"
import TeamRole from "../../models/team_role"
import { Handler, handleError } from "./handlers"

const create: Handler = async (req, res) => {
  try {
    //Validate ids are supplied
    const person_id = Number(req.query.person_id)
    const team_id = Number(req.query.team_id)
    if (!person_id) throw `person id not supplied`
    if (!team_id) throw `team id not supplied`

    //Validate person and team exist
    const person = await Person.findOne({ where: { id: person_id } })
    const team = await Team.findOne({ where: { id: team_id } })
    if (!person) throw `person with id ${person_id} not found`
    if (!team) throw `team with id ${team_id} not found`

    //Validate role does not already exist for team
    const role = String(req.query.role)
    const matchingTeamRole = await TeamRole.findOne({
      where: { role, team_id },
    })
    if (matchingTeamRole) {
      throw `role of ${role} is already taken for team with id ${team_id}`
    }

    await TeamRole.create(req.query)
    res.status(201).send()
  } catch (err) {
    handleError({ err, res, trace: "routes.team_roles.create" })
  }
}

const index: Handler = async (_, res) => {
  try {
    const teamRoles = await TeamRole.findAll()
    res.status(200).send(teamRoles)
  } catch (err) {
    handleError({ err, res, trace: "routes.team_roles.index" })
  }
}

const show: Handler = async (req, res) => {
  try {
    const teamRole = await TeamRole.findOne({ where: { id: req.params.id } })
    if (!teamRole) throw `team_role with id ${req.params.id} not found`
    res.status(200).send(teamRole)
  } catch (err) {
    handleError({ err, res, trace: "routes.team_roles.show" })
  }
}

const update: Handler = async (req, res) => {
  try {
    const [rowsAffected, _] = await TeamRole.update(req.query, {
      where: { id: req.params.id },
    })
    if (rowsAffected === 0)
      throw `unable to update team_role. check id or params`
    res.status(200).send()
  } catch (err) {
    handleError({ err, res, trace: "routes.team_roles.update" })
  }
}

const deleteFn: Handler = async (req, res) => {
  try {
    await TeamRole.destroy({ where: { id: req.params.id } })
    res.status(200).send()
  } catch (err) {
    handleError({ err, res, trace: "routes.team_roles.delete" })
  }
}

export default createRoutes({ create, index, show, update, deleteFn })
