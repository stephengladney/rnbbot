const { sendEphemeral, sendMessage } = require("./slack")
const { findTeamMemberByFullName, slackChannel, teamName } = require("../team")
const { findStagnants } = require("./jira")
const {
  slackSettings: { emojis }
} = require("../settings")

const slashCommands = {
  ignore: ({ params, stagnantCards, user }) => {
    const cardsInParams = String(params)
      .replace(/ /g, "")
      .split(",")
    cardsInParams.forEach(query => {
      const matches = findStagnants(query, stagnantCards)
      switch (matches.length) {
        case 0:
          sendEphemeral({
            channel: "emailnotifications",
            message: `${emojis.error} I dont have any cards with *'${query}'* in the stagnant queue.`,
            user
          })
          break
        case 1:
          const cardData = matches[0]
          removeFromStagnants({
            cardData: cardData,
            stagnantCards: stagnantCards
          })
          sendEphemeral({
            channel: slackChannel,
            message: `${emojis.ignore} Now ignoring ${cardData.cardNumber} \`${cardData.cardTitle}\` in ${cardData.currentStatus}.`,
            user
          })
        default:
          sendEphemeral({
            channel: slackChannel,
            message: `${emojis.error} More than one result. Narrow query.`,
            user
          })
      }
    })
  }
}

function processSlashCommand({ stagnantCards, text, user }) {
  const parsedText = String(text)
    .toLowerCase()
    .split(" ")
  const command = parsedText[0]
  const params = parsedText[1]
  if (slashCommands[command])
    slashCommands[command]({
      params: params,
      stagnantCards: stagnantCards,
      user: user
    })
  else
    sendEphemeral({
      channel: slackChannel,
      message:
        "I don't understand that command. <https://github.com/stephengladney/rnbbot|Slash commands>",
      user
    })
}

module.exports = {
  processSlashCommand
}
