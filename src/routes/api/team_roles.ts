import { createRoutes } from "./handlers"
import TeamRole from "../../models/team_role"
import { Handler, handleError } from "./handlers"

const create: Handler = async (req, res) => {
  try {
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
    res.status(200).send(teamRole)
  } catch (err) {
    handleError({ err, res, trace: "routes.team_roles.show" })
  }
}

const update: Handler = async (req, res) => {
  try {
    await TeamRole.update(req.query, { where: { id: req.params.id } })
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
