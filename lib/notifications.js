const { sendMessage } = require("./slack")
const {
  designer,
  qaEngineer,
  productManager,
  slackChannel
} = require("../team")
const {
  slackSettings: { emojis }
} = require("../settings")

const atHere = "<!here|here>"
const atMention = person =>
  person.slackHandle ? `<@${person.slackHandle}>` : ``

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
  notify: notify,
  remind: remind
}
