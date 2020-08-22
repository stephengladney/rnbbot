require("dotenv").config({ path: "../.env" })

const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const { checkforStagnants } = require("./lib/jira")
const stagnantCards = []

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(require("./routes"))

let statusPoller = setInterval(() => {
  checkforStagnants(stagnantCards)
}, 60000)

app.listen(process.env.PORT || 5000, process.env.IP, () => {
  console.log("RnBot server is now running!")
})
