const router = require("express").Router()
import { processSlashCommand } from "../../lib/slack"

router.post("/slash/", (req, res) => {
  const user = req.body.user_id
  const text = req.body.text
  processSlashCommand({
    stagnantCards: stagnantCards,
    text: text,
    user: user,
  })
  res.status(200).send()
})

module.exports = router
