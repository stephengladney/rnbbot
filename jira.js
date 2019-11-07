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

const shouldIMonitor = {
  Unassigned: false,
  "In Development": false,
  "Ready for Code Review": true,
  "Ready for Design Review": false,
  "Ready for QA": false,
  "Ready for Acceptance": false,
  "Ready for Merge": true,
  Done: false
}

const isStatusICareAboutMonitoring = status => !!shouldIMonitor[status]

function processChange({
  assignee,
  cardNumber,
  cardTitle,
  newStatus,
  oldStatus
}) {
  jiraData = {
    cardNumber: cardNumber,
    cardTitle: cardTitle,
    assignee: assignee
  }

  switch (newStatus) {
    case "Ready for Code Review":
      readyForReview(jiraData)
      break
    case "Ready for QA":
      readyForQA(jiraData)
      break
    case "Design Review":
      readyForDesignReview(jiraData)
      break
    case "Ready for Acceptance":
      readyForAcceptance(jiraData)
      break
    case "Ready for Merge":
      readyForMerge(jiraData)
    default:
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
      switch (currentStatus) {
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
  getJiraCard: getJiraCard,
  hours: hours,
  isStatusICareAboutMonitoring: isStatusICareAboutMonitoring,
  processChange: processChange,
  checkforStagnants: checkforStagnants
}
