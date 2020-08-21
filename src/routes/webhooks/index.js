const router = require("express").Router()

router.post("/jirahook", (req, res) => {
  processWebhook({
    body: req.body,
    stagnantCards: stagnantCards,
  })

  res.status(200).send("OK")
})

module.exports = router
