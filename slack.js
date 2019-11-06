require("dotenv").config()
const axios = require("axios")
const { designer, qaEngineer, productManager, slackChannel } = require("./team")

const atMention = person => `<@${person.slackHandle}>`
const atHere = "<!here|here>"
const jiraEmoji = ":jira2:"
const githubEmoji = ":github:"

const ordinal = n => {
  switch (String(n).substr(-1)) {
    case "1":
      return `${String(n)}st`
    case "2":
      return `${String(n)}nd`
    case "3":
      return `${String(n)}rd`
    default:
      return `${String(n)}th`
  }
}

const sendMessage = ({ channel, message }) => {
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
      message: `:parking: | ${jiraEmoji} <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncateTitle(
        cardTitle
      )}\` is *ready for acceptance* | ${atMention(productManager)}`
    })
  },
  remindOfReadyForAcceptance: ({ age, cardNumber, cardTitle, nthAlert }) => {
    sendMessage({
      channel: slackChannel,
      message: `:parking: ${ordinal(
        nthAlert
      )} reminder | ${jiraEmoji} <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncateTitle(
        cardTitle
      )}\` has been *ready for acceptance* for *${age}* | ${atMention(
        productManager
      )}`
    })
  },
  readyForDesignReview: ({ cardNumber, cardTitle }) => {
    sendMessage({
      channel: slackChannel,
      message: `:pencil2: | ${jiraEmoji} <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncateTitle(
        cardTitle
      )}\` is *ready for Design Review* | ${atMention(designer)}`
    })
  },
  readyForQA: ({ cardNumber, cardTitle }) => {
    sendMessage({
      channel: slackChannel,
      message: `:in_qa: | ${jiraEmoji} <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncateTitle(
        cardTitle
      )}\` is *ready for QA* | ${atMention(qaEngineer)}`
    })
  },
  readyForReview: ({ cardNumber, cardTitle }) => {
    sendMessage({
      channel: slackChannel,
      message: `:eyes: | ${jiraEmoji} <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> ${githubEmoji} <https://salesloft.atlassian.net/browse/${cardNumber}|#1486> | \`${truncateTitle(
        cardTitle
      )}\` is *ready for review* | ${atHere}`
    })
  },
  remindOfReadyForReview: ({ age, cardNumber, cardTitle, nthAlert }) => {
    sendMessage({
      channel: slackChannel,
      message: `:eyes: ${ordinal(
        nthAlert
      )} reminder | ${jiraEmoji} <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncateTitle(
        cardTitle
      )}\` has been *ready for ready for review* for *${age}* | ${atMention(
        productManager
      )}`
    })
  },
  readyForMerge: ({ assignee, cardNumber, cardTitle }) => {
    sendMessage({
      channel: slackChannel,
      message: `:white_check_mark: | ${jiraEmoji} <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncateTitle(
        cardTitle
      )}\` is *ready for merge* | ${atMention(assignee)}`
    })
  },
  remindOfReadyForMerge: ({ age, cardNumber, cardTitle, nthAlert }) => {
    sendMessage({
      channel: slackChannel,
      message: `:white_check_mark: ${ordinal(
        nthAlert
      )} reminder | ${jiraEmoji} <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncateTitle(
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
