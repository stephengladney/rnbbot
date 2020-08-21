const router = require("express").Router()

router.use("/api", require("./api"))
router.use("/slackbot", require("./slackbot"))
router.use("/webhooks", require("./webhooks"))

module.exports = router
