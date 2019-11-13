const moment = require("moment")
const axios = require("axios")
require("dotenv").config()
const { hours, isPast } = require("./numbers")
const { remind } = require("./slack")
const { jiraSettings } = require("../settings")

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
  for (let i = 0; i < arr.length; i++) {
    if (!arr[i]) break
    if (isPast(arr[i].nextAlertTime)) {
      arr[i].alertCount++
      arr[i].nextAlertTime = Date.now() + hours(2)
      jiraData = {
        age: moment().from(arr[i].lastColumnChangeTime, true),
        assignee: arr[i].assignee,
        cardNumber: arr[i].cardNumber,
        cardTitle: arr[i].cardTitle,
        nthAlert: arr[i].alertCount
      }
      const currentStatus = arr[i].currentStatus
      if (!!jiraSettings[currentStatus]) remind[currentStatus]
    }
  }
}

module.exports = {
  addToStagnants: addToStagnants,
  findStagnants: findStagnants,
  getGhToken: getGhToken,
  getJiraCard: getJiraCard,
  getPR: getPR,
  hours: hours,
  checkforStagnants: checkforStagnants,
  removeFromStagnants: removeFromStagnants
}
