require("dotenv").config()
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const { checkforStagnants, processWebhook } = require("./lib/jira")
const { processSlashCommand } = require("./lib/slash")
const stagnantCards = []

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

let statusPoller = setInterval(() => {
  checkforStagnants(stagnantCards)
}, 60000)

app.use("/api", require("./routes/api"))
app.use("/webhooks", require("./routes"))
app.use("/slackbot", require("./routes/slackbot"))

app.listen(process.env.PORT || 5000, process.env.IP, () => {
  console.log("RnBot server is now running!")
})
