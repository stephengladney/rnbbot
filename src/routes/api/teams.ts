import { createRoutes } from "./handlers"
import Team from "../../models/team"
import { Handler } from "./handlers"

const create: Handler = (req, res) => {
  Team.create(req.query)
}

const index: Handler = (req, res) => {
  Team.findAll({
    where: req.query,
  })
}

const show: Handler = (req, res) => {
  Team.findOne({ where: { id: req.params.id } })
}

const update: Handler = (req, res) => {}

const deleteFn: Handler = (req, res) => {}

export default createRoutes({ create, index, show, update, deleteFn })
