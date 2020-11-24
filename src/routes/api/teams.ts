import { createRoutes } from "./handlers"
import Team from "../../models/team"
import { Handler, handleError } from "./handlers"

const create: Handler = async (req, res) => {
  try {
    const team = await Team.create(req.query)
    res.status(201).send(team)
  } catch (err) {
    console.log(err)
    handleError({ err, res, trace: "routes.teams.create" })
  }
}

const index: Handler = async (_, res) => {
  try {
    const teams = await Team.findAll()
    res.status(200).send(teams)
  } catch (err) {
    handleError({ err, res, trace: "routes.teams.index" })
  }
}

const show: Handler = async (req, res) => {
  try {
    const team = await Team.findOne({ where: { id: req.params.id } })
    if (!team) throw `team with id ${req.params.id} not found`
    res.status(200).send(team)
  } catch (err) {
    handleError({ err, res, trace: "routes.teams.show" })
  }
}

const update: Handler = async (req, res) => {
  try {
    const [rowsAffected, _] = await Team.update(req.query, {
      where: { id: req.params.id },
    })
    if (rowsAffected === 0) throw `unable to update team. check id or params`
    res.status(200).send()
  } catch (err) {
    handleError({ err, res, trace: "routes.teams.update" })
  }
}

const deleteFn: Handler = async (req, res) => {
  try {
    await Team.destroy({ where: { id: req.params.id } })
    res.status(200).send()
  } catch (err) {
    handleError({ err, res, trace: "routes.teams.delete" })
  }
}

export default createRoutes({ create, index, show, update, deleteFn })
