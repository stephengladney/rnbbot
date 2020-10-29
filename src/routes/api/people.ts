import { createRoutes } from "./handlers"
import Person, { PersonProps } from "../../models/person"
import { Handler } from "./handlers"
import { logError } from "../../lib/logging"

const create: Handler = async (req, res) => {
  try {
    await Person.create(req.query)
    res.status(201).send()
  } catch (err) {
    res.status(500).send()
    logError(`routes.people.create: ${err}`)
  }
}

const index: Handler = async (req, res) => {
  try {
    const people = await Person.findAll()
    res.status(200).send(people)
  } catch (err) {
    res.status(500).send()
    logError(`routes.people.index: ${err}`)
  }
}

const show: Handler = async (req, res) => {
  try {
    const person = await Person.findOne({ where: { id: req.params.id } })
    res.status(200).send(person)
  } catch (err) {
    res.status(500).send()
    logError(`routes.people.show: ${err}`)
  }
}

const update: Handler = async (req, res) => {
  try {
    await Person.update(req.query, { where: { id: req.params.id } })
    res.status(200).send()
  } catch (err) {
    res.status(500).send()
    logError(`routes.people.update: ${err}`)
  }
}

const deleteFn: Handler = (req, res) => {}

export default createRoutes({ create, index, show, update, deleteFn })
