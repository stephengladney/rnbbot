import { createRoutes } from "./handlers"
import Person from "../../models/person"
import { Handler, handleError } from "./handlers"

const create: Handler = async (req, res) => {
  try {
    const person = await Person.create(req.query)
    res.status(201).send(person)
  } catch (err) {
    handleError({ err, res, trace: "routes.people.create" })
  }
}

const index: Handler = async (req, res) => {
  try {
    const people = await Person.findAll()
    res.status(200).send(people)
  } catch (err) {
    handleError({ err, res, trace: "routes.people.index" })
  }
}

const show: Handler = async (req, res) => {
  try {
    const person = await Person.findOne({ where: { id: req.params.id } })
    if (!person) throw `person with id ${req.params.id} not found`
    res.status(200).send(person)
  } catch (err) {
    handleError({ err, res, trace: "routes.people.show" })
  }
}

const update: Handler = async (req, res) => {
  try {
    const [rowsAffected, _] = await Person.update(req.query, {
      where: { id: req.params.id },
    })
    if (rowsAffected === 0) throw `unable to update person. check id or params`
    res.status(200).send()
  } catch (err) {
    handleError({ err, res, trace: "routes.people.update" })
  }
}

const deleteFn: Handler = async (req, res) => {
  try {
    await Person.destroy({ where: { id: req.params.id } })
    res.status(200).send()
  } catch (err) {
    handleError({ err, res, trace: "routes.people.delete" })
  }
}

export default createRoutes({ create, index, show, update, deleteFn })
