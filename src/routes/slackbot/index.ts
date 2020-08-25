const router = require("express").Router()
import { processSlashCommand } from "../../lib/slack/slash_commands"
import { stagnantCards } from "../../app"

router.post("/slash/", (req, res) => {
  const user = req.body.user_id
  const text = req.body.text
  processSlashCommand({
    text,
    user,
  })
  res.status(200).send()
})

export default router
