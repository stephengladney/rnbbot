const moment = require("moment")
const axios = require("axios")
require("dotenv").config()
const { hours, isMoreThanTwoHoursAgo, isPast } = require("./numbers")
const {
  notify: {
    readyForAcceptance,
    readyForDesignReview,
    readyForMerge,
    remindOfReadyForMerge,
    readyForQA,
    readyForReview,
    remindOfReadyForReview
  }
} = require("./slack")

function removeFromStagnants({ cardData, stagnantCards }) {
  const cardIndex = stagnantCards.findIndex(
    card => card.cardNumber === cardData.cardNumber
  )
  if (cardIndex !== -1) stagnantCards.splice(cardIndex, 1)
}

function addToStagnants({ cardData, stagnantCards }) {
  const currentStatus = cardData.currentStatus
  if (!!statusSettings[currentStatus].monitorForStagnant) {
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
    `https://salesloft.atlassian.net/rest/api/2/issue/${cardNumber}?fields=status`,
    {
      headers: {
        Authorization: "Basic " + process.env.JIRA_TOKEN,
        header: "Accept: application/json"
      }
    }
  )
}

async function checkforStagnants(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (!arr[i]) break
    // const lastStatus = arr[i].lastStatus
    // const currentStatus = (await getJiraCard(arr[i].cardNumber)).data.fields
    //   .status.name

    if (
      isMoreThanTwoHoursAgo(arr[i].lastColumnChangeTime) &&
      isPast(arr[i].nextAlertTime)
    ) {
      arr[i].alertCount++
      arr[i].nextAlertTime = Date.now() + hours(2)
      jiraData = {
        age: moment().from(arr[i].lastColumnChangeTime, true),
        assignee: arr[i].assignee,
        cardNumber: arr[i].cardNumber,
        cardTitle: arr[i].cardTitle,
        nthAlert: arr[i].alertCount
      }
      switch (arr[i].currentStatus) {
        case "Ready for Code Review":
          remindOfReadyForReview(jiraData)
          break
        case "Ready for Merge":
          remindOfReadyForMerge(jiraData)
        default:
      }
    }
  }
}

module.exports = {
  addToStagnants: addToStagnants,
  getJiraCard: getJiraCard,
  hours: hours,
  checkforStagnants: checkforStagnants,
  removeFromStagnants: removeFromStagnants
}
