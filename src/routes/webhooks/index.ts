import { processWebhook } from "../../lib/jira"
import { stagnantCards } from "../../app"
import { Handler } from "../api/handlers"

const router = require("express").Router()

const JiraWebhookHandler: Handler = (req, res) => {
  processWebhook({
    body: req.body,
    stagnantCards,
  })

  res.status(200).send("OK")
}

router.post("/jirahook", JiraWebhookHandler)

export default router
