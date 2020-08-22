import { createRoutes } from "./methods"
import Person from "../../models/person"

const create = (req, res) => {
  Person.createNew(req.query)
}

const index = (req, res) => {
  Person.findAll({
    where: req.query,
  })
}

const show = (req, res) => {
  Person.findOne({ where: { id: req.params.id } })
}

const update = (req, res) => {}

const deleteFn = (req, res) => {}

module.exports = createRoutes({ create, index, show, update, deleteFn })
