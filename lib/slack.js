require("dotenv").config()
const axios = require("axios")
const { hours, humanizeDay } = require("./numbers")
const {
  slackSettings: {
    days,
    hours: { start, stop }
  },
  timezoneOffset
} = require("../settings")

function isWithinSlackHours() {
  const timeStamp = Date.now() + hours(timezoneOffset)
  let currentHour = new Date(timeStamp).getHours()
  const currentDay = humanizeDay(new Date(timeStamp).getDay())

  if (!days[currentDay]) return false
  else if (currentHour < start || currentHour > stop) return false
  else return true
}

function sendMessage({ channel, message }) {
  if (!isWithinSlackHours()) {
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
  if (!isWithinSlackHours()) {
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
  sendEphemeral,
  sendMessage
}
