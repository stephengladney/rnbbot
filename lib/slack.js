require("dotenv").config()
const axios = require("axios")
const { hours, humanizeDay } = require("./numbers")
const {
  slackSettings: {
    emojis,
    days,
    hours: { start, stop }
  },
  timezoneOffset,
  jiraSettings
} = require("../settings")
const { slackChannel } = require("../team")
const { findStagnants, removeFromStagnants } = require("./jira")
const { notifyMessage, remindMessage } = require("./notifications")

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

function sendEphemeral({ channel, message, user }) {
  if (!withinSlackHours()) {
    console.log(`[outside of hours] ${message}`)
    return
  }
  axios({
    method: "post",
    url: "https://slack.com/api/chat.postEphemeral",
    headers: {
      Authorization: `Bearer ${process.env.SLACK_TOKEN}`
    },
    contentType: "application/x-www-form-urlencoded",
    data: {
      attachments: [],
      channel: channel,
      text: message,
      user: user.slackId
    }
  })
}

module.exports = {
  sendMessage,
  notifyMessage
}
