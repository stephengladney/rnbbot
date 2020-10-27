const router = require("express").Router()
// import { processSlashCommand } from "../../lib/slack/slash_commands"
import { stagnantCards } from "../../app"
import { Handler } from "../api/handlers"

const SlashCommandHandler: Handler = (req, res) => {
  const user = req.body.user_id
  const text = req.body.text
  // processSlashCommand({
  //   text,
  //   user,
  // })
  res.status(200).send()
}

router.post("/slash/", SlashCommandHandler)

export default router
