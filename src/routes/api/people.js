// const express = require("express")
// const router = express.Router()

// const pg = require("pg")
// const db = require("../models")
// const { Op } = require("sequelize")

// router.get("", (req, res) => {
//   db.Person.findAll({
//     where: req.query,
//   })
//     .then((people) => res.status(200).send(people))
//     .catch((err) => res.status(500).send(err))
// })

// router.post("", (req, res) => {
//   db.Person.create(req.query)
// })

// router.get("/:id", (req, res) => {
//   db.Person.findOne({ where: { id: req.params.id } })
// })

// router.put("/:id", (req, res) => {})

// router.delete("/:id", (req, res) => {})

// module.exports = router
