require("dotenv").config()
const axios = require("axios")
const { slackChannel } = require("../team")
const { ordinal, hours, humanizeDay } = require("./numbers")
const {
  slackSettings: {
    emojis,
    days,
    hours: { start, stop }
  },
  timezoneOffset,
  jiraSettings
} = require("../settings")
const { notify, remind } = require("./notifications")
const { findStagnants, removeFromStagnants } = require("./jira")

function withinSlackHours() {
  const timeStamp = Date.now() + hours(timezoneOffset)
  const currentHour = new Date(timeStamp).getHours()
  const currentDay = humanizeDay(new Date(timeStamp).getDay())

  if (!days[currentDay]) return false
  else if (currentHour < start || currentHour > stop) return false
  else return true
}

function sendMessage({ channel, message }) {
  if (!withinSlackHours()) {
    console.log(`[outside of hours] ${message}`)
    return
  }
  axios({
    method: "post",
    url: "https://slack.com/api/chat.postMessage",
    headers: {
      Authorization: `Bearer ${process.env.SLACK_TOKEN}`
    },
    contentType: "application/x-www-form-urlencoded",
    data: { channel: channel, text: message }
  })
}

function processSlashCommand({ text, stagnantCards }) {
  const parsedText = String(text)
    .toLowerCase()
    .split(" ")
  const command = parsedText[0]
  const params = parsedText[1]
  if (slashCommands[command])
    slashCommands[command]({
      params: params,
      stagnantCards: stagnantCards
    })
  else
    sendMessage({
      channel: slackChannel,
      message:
        "I don't understand that command. <https://github.com/stephengladney/rnbbot|Slash commands>"
    })
}

const slashCommands = {
  ignore: ({ params, stagnantCards }) => {
    const cardsInParams = String(params)
      .replace(/ /g, "")
      .split(",")
    cardsInParams.forEach(query => {
      const matches = findStagnants(query, stagnantCards)
      switch (matches.length) {
        case 0:
          sendMessage({
            channel: slackChannel,
            message: `${emojis.error} I dont have any cards with *'${query}'* in the stagnant queue.`
          })
          break
        case 1:
          const cardData = matches[0]
          removeFromStagnants({
            cardData: cardData,
            stagnantCards: stagnantCards
          })
          sendMessage({
            channel: slackChannel,
            message: `${emojis.ignore} Now ignoring ${cardData.cardNumber} \`${cardData.cardTitle}\` in ${cardData.currentStatus}.`
          })
        default:
          sendMessage({
            channel: slackChannel,
            message: `${emojis.error} More than one result. Narrow query.`
          })
      }
    })
  }
}

function truncateTitle(title) {
  return String(title).length <= 50
    ? title
    : `${String(title).substr(0, 50)}...`
}

function notifyOfEntry({ cardData: { currentStatus } }) {
  if (!jiraSettings[currentStatus]) return
  if (jiraSettings[currentStatus].notifyOnEntry) notify[currentStatus](cardData)
}

module.exports = {
  sendMessage: sendMessage,
  truncateTitle: truncateTitle,
  notifyOfEntry,
  processSlashCommand: processSlashCommand
}
