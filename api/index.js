const express = require("express")
const router = express.Router()

router.use("/people", require("./people"))
router.use("/teams", require("./teams"))
// router.use("/team_roles", require("./people"))

module.exports = router
