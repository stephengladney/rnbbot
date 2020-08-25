import { createRoutes } from "./handlers"
import Person, { PersonProps } from "../../models/person"
import { Handler } from "./handlers"

const create: Handler = (req, res) => {
  const newPersonProps: PersonProps = req.body
  Person.createNew(newPersonProps)
}

const index: Handler = (req, res) => {
  Person.findAll({
    where: req.query,
  })
}

const show: Handler = (req, res) => {
  Person.findOne({ where: { id: req.params.id } })
}

const update: Handler = (req, res) => {}

const deleteFn: Handler = (req, res) => {}

export default createRoutes({ create, index, show, update, deleteFn })
