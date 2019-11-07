const moment = require("moment")
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

const inDevelopment = "In Development"
const merged = {
  newStatus: "Done",
  oldStatus: "Merged"
}
const GA = "GA"

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

function isStatusICareAbout(status) {
  if (status === "Ready for Code Review") return true
  else if (status === "Ready for Merge") return true
  else return false
}

function isLongerThanTwoHours(time) {
  return (
    String(time).includes("hours") ||
    String(time).includes("day") ||
    String(time).includes("week")
  )
}

function checkforStagnants(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (!arr[i]) break
    const lastStatus = arr[i].lastStatus
    // const currentStatus = getCardStatus(arr[i].cardNumber)
    const currentStatus = lastStatus
    if (lastStatus !== currentStatus) {
      arr.splice(i, 1)
      i--
      continue
    }
    const howLongInColumn = arr[i].lastColumnChangeTime.fromNow(true)
    const howLongSinceLastAlert = arr[i].lastAlertTime.fromNow(true)
    const hoursSinceLastAlert = howLongSinceLastAlert.includes("hours")
      ? Number(
          howLongSinceLastAlert.substr(0, howLongSinceLastAlert.length - 6)
        )
      : 0

    if (
      lastStatus === currentStatus &&
      isStatusICareAbout(currentStatus) &&
      isLongerThanTwoHours(howLongInColumn) &&
      isLongerThanTwoHours(howLongSinceLastAlert) &&
      hoursSinceLastAlert % 2 === 0
    ) {
      arr[i].alertCount++
      arr[i].lastAlert = moment()
      jiraData = {
        age: howLongInColumn,
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
  processChange: processChange,
  checkforStagnants: checkforStagnants
}
