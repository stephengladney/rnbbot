const router = require("express").Router()
import PeopleRouter from "./people"
import TeamsRouter from "./teams"

router.use("/people", PeopleRouter)
router.use("/teams", TeamsRouter)

export default router
