const moment = require("moment")
const axios = require("axios")
require("dotenv").config()
const { hours, isPast } = require("./numbers")
const { notifyOfEntry, remind } = require("./slack")
const { jiraSettings } = require("../settings")
const { findTeamMemberByEmail, teamName } = require("../team")

function processWebhook({ body, stagnantCards }) {
  const fieldThatChanged = body.changelog.items[0].fieldId
  const cardData = {
    assignee: body.issue.fields.assignee
      ? findTeamMemberByEmail(body.issue.fields.assignee.emailAddress)
      : "N/A",
    cardNumber: body.issue.key,
    cardTitle: body.issue.fields.summary,
    currentStatus: body.changelog.items[0].toString,
    previousStatus: body.changelog.items[0].fromString,
    teamAssigned: body.issue.fields.customfield_10025
      ? body.issue.fields.customfield_10025.value
      : "No team assigned"
  }
  if (fieldThatChanged !== "status" || cardData.teamAssigned !== teamName)
    return

  removeFromStagnants({
    cardData: cardData,
    stagnantCards: stagnantCards
  })

  notifyOfEntry(cardData)

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

function getGhToken() {
  return axios.post("https://github.com/login/oauth/access_token", {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code: null
  })
}

function getPR(cardNumber) {
  return axios.get(
    `https://salesloft.atlassian.net/rest/dev-status/1.0/issue/detail?issueId=${cardNumber}&applicationType=github&dataType=pullrequest`,
    {
      headers: {
        Authorization: "Basic " + process.env.JIRA_TOKEN,
        header: "Accept: application/json"
      }
    }
  )
}

function checkforStagnants(arr) {
  arr.forEach(card => {
    if (!card) break
    if (isPast(card.nextAlertTime)) {
      card.alertCount++
      card.nextAlertTime = Date.now() + hours(2)
      jiraData = {
        age: moment().from(card.lastColumnChangeTime, true),
        assignee: card.assignee,
        cardNumber: card.cardNumber,
        cardTitle: card.cardTitle,
        nthAlert: card.alertCount
      }
      const currentStatus = card.currentStatus
      if (!!jiraSettings[currentStatus]) remind[currentStatus]
    }
  })
}

module.exports = {
  addToStagnants: addToStagnants,
  checkforStagnants: checkforStagnants,
  findStagnants: findStagnants,
  getGhToken: getGhToken,
  getJiraCard: getJiraCard,
  getPR: getPR,
  hours: hours,
  processWebhook: processWebhook,
  removeFromStagnants: removeFromStagnants
}
