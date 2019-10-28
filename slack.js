require("dotenv").config()
const axios = require("axios")
const { designer, qaEngineer, engineers } = require("./team")

const atMention = person => `<@${person.slackHandle}>`
const atHere = "<!here|here>"

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
  readyForQA: ({ channel, jiraCard, cardTitle }) => {
    sendMessage({
      channel: channel,
      message: `:in_qa: [<https://salesloft.atlassian.net/browse/${jiraCard}|${jiraCard}>] \`${truncateTitle(
        cardTitle
      )}\` is *ready for QA* ${atMention(qaEngineer)}>`
    })
  },
  readyForReview: ({ channel, jiraCard, cardTitle }) => {
    sendMessage({
      channel: channel,
      message: `:eyes: [<https://salesloft.atlassian.net/browse/${jiraCard}|${jiraCard}>] \`${truncateTitle(
        cardTitle
      )}\` is *ready for review* ${atHere}`
    })
  },
  readyForMerge: ({ channel, jiraCard, cardTitle, engineer }) => {
    sendMessage({
      channel: channel,
      message: `:merged: [<https://salesloft.atlassian.net/browse/${jiraCard}|${jiraCard}>] \`${truncateTitle(
        cardTitle
      )}\` is *ready for merge* ${atMention(engineer)}`
    })
  }
}

module.exports = {
  sendMessage: sendMessage,
  truncateTitle: truncateTitle,
  notify: notify
}
