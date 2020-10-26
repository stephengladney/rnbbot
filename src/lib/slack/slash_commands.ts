// import { sendEphemeral, sendMessage } from "."
// const { slackChannel } = require("../../team")
// import {
//   CardData,
//   findStagnants,
//   removeFromStagnants,
//   StagnantCards,
// } from "../jira"
// const {
//   slackSettings: { emojis },
// } = require("../../settings")

// interface SlashCommandParams {
//   text: string
//   user: string
// }

// interface IgnoreParams {
//   params: string
//   user: string
// }

// function ignore({ params, user }: IgnoreParams) {
//   const stagnantCards: StagnantCards = [] // <<--------FIX THIS
//   const cardsInParams = String(params).replace(/ /g, "").split(",")

//   cardsInParams.forEach(query => {
//     const matches: CardData[] = findStagnants(query, stagnantCards)
//     if (matches.length === 0) {
//       sendEphemeral({
//         channel: slackChannel,
//         message: `${emojis.error} I dont have any cards with *'${query}'* in the stagnant queue.`,
//         user,
//       })
//     } else if (matches.length === 1) {
//       const cardData = matches[0]
//       removeFromStagnants({
//         cardData,
//         stagnantCards,
//       })
//       sendEphemeral({
//         channel: slackChannel,
//         message: `${emojis.ignore} Now ignoring ${cardData.cardNumber} \`${cardData.cardTitle}\` in ${cardData.currentStatus}.`,
//         user,
//       })
//     } else {
//       sendEphemeral({
//         channel: slackChannel,
//         message: `${emojis.error} More than one result. Narrow query.`,
//         user,
//       })
//     }
//   })
// }

// export function processSlashCommand({ text, user }: SlashCommandParams) {
//   const parsedText = String(text).toLowerCase().split(" ")
//   const command = parsedText[0]
//   const params = parsedText[1]

//   switch (command) {
//     case "ignore":
//       ignore({ params, user })
//       break
//     default:
//       sendEphemeral({
//         channel: slackChannel,
//         message:
//           "I don't understand that command. <https://github.com/stephengladney/rnbbot|Slash commands>",
//         user,
//       })
//   }
// }
