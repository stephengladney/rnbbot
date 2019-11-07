require("dotenv").config()
const axios = require("axios")
const { designer, qaEngineer, productManager, slackChannel } = require("./team")
const { ordinal } = require("./numbers")
const atMention = person => `<@${person.slackHandle}>`
const atHere = "<!here|here>"
const emojis = {
  jira: ":jira2:",
  github: ":github:",
  readyForAcceptance: ":parking:",
  readyForDesignReview: ":pencil2:",
  readyForQa: ":in_qa:",
  readyForReview: ":eyes:",
  readyforMerge: ":white_check_mark:"
}

const sendMessage = ({ channel, message }) => {
  const currentHour = new Date().getHours() + process.env.TIMEZONE_OFFSET
  console.log(currentHour)
  if (
    currentHour < process.env.SLACK_WINDOW_START ||
    currentHour > process.env.SLACK_WINDOW_STOP
  )
    return null

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

const truncateTitle = title => {
  return String(title).length <= 50
    ? title
    : `${String(title).substr(0, 50)}...`
}

const notify = {
  readyForAcceptance: ({ cardNumber, cardTitle }) => {
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
  readyForDesignReview: ({ cardNumber, cardTitle }) => {
    sendMessage({
      channel: slackChannel,
      message: `${emojis.readyForDesignReview} | ${
        emojis.jira
      } <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncateTitle(
        cardTitle
      )}\` is *ready for Design Review* | ${atMention(designer)}`
    })
  },
  readyForQA: ({ cardNumber, cardTitle }) => {
    sendMessage({
      channel: slackChannel,
      message: `${emojis.readyForQa} | ${
        emojis.jira
      } <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncateTitle(
        cardTitle
      )}\` is *ready for QA* | ${atMention(qaEngineer)}`
    })
  },
  readyForReview: ({ cardNumber, cardTitle }) => {
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
  readyForMerge: ({ assignee, cardNumber, cardTitle }) => {
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
