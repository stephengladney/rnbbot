require("dotenv").config()
const axios = require("axios")
const {
  designer,
  qaEngineer,
  productManager,
  slackChannel
} = require("../team")
const { ordinal, hours } = require("./numbers")
const {
  slack: {
    emojis,
    days,
    hours: { start, stop },
    timezoneOffset
  },
  statusSettings
} = require("../settings")
const atMention = person => `<@${person.slackHandle}>`
const atHere = "<!here|here>"

function withinSlackHours() {
  const timeStamp = Date.now()
  const currentHour = new Date(timeStamp + hours(timezoneOffset)).getHours()
  const currentDay = new Date(timeStamp + hours(timezoneOffset)).getDay()
  if (!days[currentDay]) return false
  else if (currentHour < start || currentHour > stop) return false
  else return true
}

function sendMessage({ channel, message }) {
  if (!withinSlackHours()) return
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

function truncateTitle(title) {
  return String(title).length <= 50
    ? title
    : `${String(title).substr(0, 50)}...`
}

const notify = {
  notifyOfEntry: cardData => {
    const currentStatus = cardData.currentStatus
    if (!!statusSettings[currentStatus].notifyOnEntry)
      this.notify[currentStatus](cardData)
  },
  "Readt for Acceptance": ({ cardNumber, cardTitle }) => {
    sendMessage({
      channel: slackChannel,
      message: `${emojis.readyForAcceptance} | ${
        emojis.jira
      } <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncateTitle(
        cardTitle
      )}\` is *ready for acceptance* | ${atMention(productManager)}`
    })
  },
  remindOfReadyForAcceptance: ({ age, cardNumber, cardTitle, nthAlert }) => {
    sendMessage({
      channel: slackChannel,
      message: `${emojis.readyForAcceptance} ${ordinal(nthAlert)} reminder | ${
        emojis.jira
      } <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncateTitle(
        cardTitle
      )}\` has been *ready for acceptance* for *${age}* | ${atMention(
        productManager
      )}`
    })
  },
  "Ready for Design Review": ({ cardNumber, cardTitle }) => {
    sendMessage({
      channel: slackChannel,
      message: `${emojis.readyForDesignReview} | ${
        emojis.jira
      } <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncateTitle(
        cardTitle
      )}\` is *ready for Design Review* | ${atMention(designer)}`
    })
  },
  "Ready for QA": ({ cardNumber, cardTitle }) => {
    sendMessage({
      channel: slackChannel,
      message: `${emojis.readyForQa} | ${
        emojis.jira
      } <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncateTitle(
        cardTitle
      )}\` is *ready for QA* | ${atMention(qaEngineer)}`
    })
  },
  "Ready for Code Review": ({ cardNumber, cardTitle }) => {
    console.log("ready for code review function hit")
    sendMessage({
      channel: slackChannel,
      message: `${emojis.readyForReview} | ${
        emojis.jira
      } <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> ${
        emojis.github
      } <https://salesloft.atlassian.net/browse/${cardNumber}|#1486> | \`${truncateTitle(
        cardTitle
      )}\` is *ready for review* | ${atHere}`
    })
  },
  remindOfReadyForReview: ({ age, cardNumber, cardTitle, nthAlert }) => {
    sendMessage({
      channel: slackChannel,
      message: `${emojis.readyForReview} ${ordinal(nthAlert)} reminder | ${
        emojis.jira
      } <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncateTitle(
        cardTitle
      )}\` has been *ready for review* for *${age}* | ${atMention(
        productManager
      )}`
    })
  },
  "Ready for Merge": ({ assignee, cardNumber, cardTitle }) => {
    sendMessage({
      channel: slackChannel,
      message: `${emojis.readyforMerge} | ${
        emojis.jira
      } <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncateTitle(
        cardTitle
      )}\` is *ready for merge* | ${atMention(assignee)}`
    })
  },
  remindOfReadyForMerge: ({ age, cardNumber, cardTitle, nthAlert }) => {
    sendMessage({
      channel: slackChannel,
      message: `${readyforMerge} ${ordinal(nthAlert)} reminder | ${
        emojis.jira
      } <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncateTitle(
        cardTitle
      )}\` has been *ready for merge* for *${age}* | ${atMention(
        productManager
      )}`
    })
  }
}

module.exports = {
  sendMessage: sendMessage,
  truncateTitle: truncateTitle,
  notify: notify
}
