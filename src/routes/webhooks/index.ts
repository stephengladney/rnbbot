import { processWebhook } from "../../lib/jira"
import { stagnantCards } from "../../app"

const router = require("express").Router()

router.post("/jirahook", (req, res) => {
  processWebhook({
    body: req.body,
    stagnantCards,
  })

  res.status(200).send("OK")
})

export default router
