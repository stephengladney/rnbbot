const { createRoutes } = require("../methods")
const Team = require("../../models/team")

const create = (req, res) => {
  Team.create(req.query)
}

const index = (req, res) => {
  Team.findAll({
    where: req.query,
  })
}

const show = (req, res) => {
  Team.findOne({ where: { id: req.params.id } })
}

const update = (req, res) => {}

const deleteFn = (req, res) => {}

module.exports = createRoutes({ create, index, show, update, deleteFn })
