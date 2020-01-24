const { sendMessage } = require("./slack")
const { findTeamMemberByFullName, slackChannel, teamName } = require("../team")
const { findStagnants } = require("./jira")
const {
  slackSettings: { emojis }
} = require("../settings")

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

module.exports = {
  processSlashCommand
}
