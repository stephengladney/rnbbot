const moment = require("moment")
const {
  notify: {
    readyForAcceptance,
    readyForDesignReview,
    readyForMerge,
    readyForQA,
    readyForReview
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
  for (let i = 0; i < arr.length; i++) {
    const lastStatus = arr[i].lastStatus
    const currentStatus = getCardStatus(arr[i].cardNumber)
    let howLongInColumn = String(arr[i].lastColumnChangeTime.fromNow())
    howLongInColumn = howLongInColumn.substr(0, howLongInColumn.length - 4)
    const howLongSinceLastAlert = arr[i].lastAlert.fromNow()
    if (
      lastStatus === currentStatus &&
      String(howLongInColumn).includes("hours") &&
      String(howLongSinceLastAlert).includes("hours")
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
  }
}

module.exports = {
  processChange: processChange,
  checkforStagnants: checkforStagnants
}
