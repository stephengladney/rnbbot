require("dotenv").config()
const axios = require("axios")
const {
  designer,
  qaEngineer,
  productManager,
  slackChannel
} = require("../team")
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
const atMention = person => `<@${person.slackHandle}>`
const atHere = "<!here|here>"

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
    console.log("outside of hours")
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
  switch (command) {
    case "ignore":
      break
    default:
      return "I don't understand."
  }
}

function truncateTitle(title) {
  return String(title).length <= 50
    ? title
    : `${String(title).substr(0, 50)}...`
}

function notifyOfEntry(cardData) {
  const currentStatus = cardData.currentStatus
  if (!!jiraSettings[currentStatus].notifyOnEntry)
    notify[currentStatus](cardData)
}

const notify = {
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
    sendMessage({
      channel: slackChannel,
      message: `${emojis.readyForReview} | ${
        emojis.jira
      } <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncateTitle(
        cardTitle
      )}\` is *ready for review* | ${atHere}`
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
  }
}

const remind = {
  "Ready for Acceptance": ({ age, cardNumber, cardTitle, nthAlert }) => {
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
  "Ready for Merge": ({ age, cardNumber, cardTitle, nthAlert }) => {
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
  },
  "Ready for Code Review": ({ age, cardNumber, cardTitle, nthAlert }) => {
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
  }
}

module.exports = {
  sendMessage: sendMessage,
  truncateTitle: truncateTitle,
  notify: notify,
  notifyOfEntry,
  processSlashCommand: processSlashCommand,
  remind: remind
}
