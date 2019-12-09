const {
  designer,
  qaEngineer,
  productManager,
  slackChannel
} = require("../team")

function truncateTitle(title) {
  return String(title).length <= 50
    ? title
    : `${String(title).substr(0, 50)}...`
}

function notifyMessage({ cardNumber, cardTitle, currentStatus }) {
  const truncatedTitle = truncateTitle(cardTitle, 50)
  switch (currentStatus) {
    case "Ready for Acceptance":
      return `${emojis.readyForAcceptance} | ${
        emojis.jira
      } <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncatedTitle}\` is *ready for acceptance* | ${atMention(
        productManager
      )}`
    case "Ready for Design Review":
      return `${emojis.readyForDesignReview} | ${
        emojis.jira
      } <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncatedTitle}\` is *ready for Design Review* | ${atMention(
        designer
      )}`
    case "Ready for QA":
      return `${emojis.readyForQa} | ${
        emojis.jira
      } <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncatedTitle}\` is *ready for QA* | ${atMention(
        qaEngineer
      )}`
    case "Ready for Code Review":
      return `${emojis.readyForReview} | ${emojis.jira} <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncatedTitle}\` is *ready for review* | ${atHere}`
    case "Ready for Merge":
      return `${emojis.readyforMerge} | ${
        emojis.jira
      } <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncatedTitle}\` is *ready for merge* | ${atMention(
        assignee
      )}`
    default:
  }
}

const remind = {
  "Ready for Acceptance": ({ age, cardNumber, cardTitle, nthAlert }) => {
    sendMessage({
      channel: slackChannel,
      message: `${emojis.readyForAcceptance} ${ordinal(nthAlert)} reminder | ${
        emojis.jira
      } <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncatedTitle}
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
      } <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncatedTitle}
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
      } <https://salesloft.atlassian.net/browse/${cardNumber}|${cardNumber}> | \`${truncatedTitle}
      )}\` has been *ready for review* for *${age}* | ${atMention(
        productManager
      )}`
    })
  }
}
