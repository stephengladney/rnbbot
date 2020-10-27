import { createRoutes } from "./handlers"
import Person, { PersonProps } from "../../models/person"
import { Handler } from "./handlers"
import { logError } from "../../lib/logging"

const create: Handler = async (req, res) => {
  const newPersonProps: PersonProps = req.body
  try {
    Person.createNew(newPersonProps)
  } catch (err) {
    logError(`routes.people.create: ${err}`)
    throw err
  }
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
