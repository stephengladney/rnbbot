const router = require("express").Router()
import PeopleRouter from "./people"
import TeamsRouter from "./teams"

router.use("/people", PeopleRouter)
router.use("/teams", TeamsRouter)
// router.use("/team_roles", require("./people"))

export default router
