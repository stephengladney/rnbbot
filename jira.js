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

function checkforStagnants(arr) {
  if (arr.length === 0) return
  for (let i = 0; i < arr.length; i++) {
    const lastStatus = arr[i].lastStatus
    // const currentStatus = getCardStatus(arr[i].cardNumber)
    const currentStatus = lastStatus
    let howLongInColumn = String(arr[i].lastColumnChangeTime.fromNow())
    howLongInColumn = howLongInColumn.substr(0, howLongInColumn.length - 4)
    const howLongSinceLastAlert = arr[i].lastAlertTime.fromNow()
    const hoursSinceLastAlert = Number(
      howLongSinceLastAlert.substr(0, howLongSinceLastAlert.length - 10)
    )

    if (
      lastStatus === currentStatus &&
      (currentStatus === "Ready for Code Review" ||
        currentStatus === "Ready for Merge") &&
      howLongInColumn.includes("hours") &&
      howLongSinceLastAlert.includes("hours") &&
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
