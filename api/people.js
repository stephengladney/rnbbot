const express = require("express")
const router = express.Router()

router.get("/create", (req, res) => {
  res.status(200).send("endpoint 1")
})
router.get("/delete", (req, res) => {
  res.status(200).send("endpoint 2")
})

module.exports = router
