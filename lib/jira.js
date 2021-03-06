const moment = require("moment")
const axios = require("axios")
require("dotenv").config()
const { hours, isPast } = require("./numbers")
const { isWithinSlackHours, sendEphemeral, sendMessage } = require("./slack")
const { isNotifyEnabled, notifications } = require("./notifications")
const { jiraSettings } = require("../settings")
const { findPullRequests } = require("./github")
const {
  designer,
  findTeamMemberByFullName,
  qaEngineer,
  productManager,
  slackChannel,
  teamName
} = require("../team")

function composeAndSendMessage({ cardData, event }) {
  const whoReceivesEphemeral = status => {
    switch (status) {
      case "Ready for QA":
        return qaEngineer
      case "Ready for Acceptance":
        return productManager
      case "Ready for Design Review":
        return designer
      default:
        return findTeamMemberByFullName(body.issue.fields.assignee.displayName)
    }
  }
  const methodFromSettings = jiraSettings[cardData.currentStatus].method
  const message = notifications(cardData)[event][methodFromSettings]()
  methodFromSettings === "channel" &&
    sendMessage({
      channel: slackChannel,
      message
    })
  methodFromSettings === "ephemeral" &&
    sendEphemeral({
      channel: slackChannel,
      message,
      user: whoReceivesEphemeral(cardData.currentStatus)
    })
}

async function processWebhook({ body, stagnantCards }) {
  const fieldThatChanged = body.changelog.items[0].fieldId
  const teamAssigned = body.issue.fields.customfield_10025
    ? body.issue.fields.customfield_10025.value
    : "No team assigned"

  if (fieldThatChanged !== "status" || teamAssigned !== teamName) return

  const foundPullRequests = await findPullRequests(body.issue.key.substr(3))

  const cardData = {
    assignee: body.issue.fields.assignee
      ? findTeamMemberByFullName(body.issue.fields.assignee.displayName)
      : { firstName: "No", lastName: "assignee", slackHandle: "notassigned" },
    cardNumber: body.issue.key,
    cardTitle: body.issue.fields.summary,
    currentStatus: body.changelog.items[0].toString,
    previousStatus: body.changelog.items[0].fromString,
    pullRequests: foundPullRequests.some(pr => pr.includes("Error"))
      ? []
      : foundPullRequests,
    teamAssigned: teamAssigned
  }

  removeFromStagnants({
    cardData: cardData,
    stagnantCards: stagnantCards
  })

  isNotifyEnabled({ status: cardData.currentStatus }).notifyOnEntry &&
    composeAndSendMessage({ cardData, event: "entry" })

  isNotifyEnabled({ status: cardData.currentStatus }).monitorForStagnant &&
    addToStagnants({
      cardData: cardData,
      stagnantCards: stagnantCards
    })
}

function removeFromStagnants({ cardData, stagnantCards }) {
  const cardIndex = stagnantCards.findIndex(
    card => card.cardNumber === cardData.cardNumber
  )
  if (cardIndex !== -1) stagnantCards.splice(cardIndex, 1)
}

function findStagnants(query, stagnantCards) {
  const queryType = isNaN(Number(query)) ? "title" : "number"
  let match
  if (queryType === "title") {
    match = stagnantCards.filter(card =>
      card.cardTitle.toLowerCase().includes(query.toLowerCase())
    )
  } else if (queryType === "number") {
    match = stagnantCards.filter(card =>
      String(card.cardNumber).includes(String(query))
    )
  }
  return match
}

function addToStagnants({ cardData, stagnantCards }) {
  const currentStatus = cardData.currentStatus
  if (!!jiraSettings[currentStatus].monitorForStagnant) {
    const timeStamp = Date.now()
    stagnantCards.push({
      ...cardData,
      alertCount: 1,
      nextAlertTime: timeStamp + hours(2),
      lastColumnChangeTime: timeStamp
    })
  }
}
function getJiraCard(cardNumber) {
  return axios.get(
    `https://salesloft.atlassian.net/rest/api/2/issue/${cardNumber}`,
    {
      headers: {
        Authorization: "Basic " + process.env.JIRA_TOKEN,
        header: "Accept: application/json"
      }
    }
  )
}

function checkforStagnants(arr) {
  if (!isWithinSlackHours()) return
  arr.forEach(card => {
    if (isPast(card.nextAlertTime)) {
      card.alertCount++
      card.nextAlertTime = Date.now() + hours(2)
      card.age = moment().from(card.lastColumnChangeTime, true)
      composeAndSendMessage({ cardData: card, event: "stagnant" })
    }
  })
}

module.exports = {
  addToStagnants,
  checkforStagnants,
  findStagnants,
  getJiraCard,
  hours,
  processWebhook,
  removeFromStagnants
}
