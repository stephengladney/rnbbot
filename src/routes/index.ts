const router = require("express").Router()
import apiRouter from "./api"
import slackbotRouter from "./slackbot"
import webhooksRouter from "./webhooks"
router.use("/api", apiRouter)
router.use("/slackbot", slackbotRouter)
router.use("/webhooks", webhooksRouter)

export default router
