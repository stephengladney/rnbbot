const {
  notify: {
    readyForAcceptance,
    readyForDesignReview,
    readyForMerge,
    readyForQA,
    readyForReview
  }
} = require("./slack")

const designReview = "Design Review"
const inDevelopment = "In Development"
const readyForCodeReview = "Ready for Code Review"
const readyForQa = "Ready for QA"
const readyForAcceptance = "Ready for Acceptance"
const readyForMerge = "Ready for Merge"
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
    case readyForCodeReview:
      readyForReview(jiraData)
      break
    case readyForQa:
      readyForQA(jiraData)
      break
    case designReview:
      readyForDesignReview(jiraData)
      break
    case readyForAcceptance:
      readyForAcceptance(jiraData)
      break
    case readyForMerge:
      readyForMerge(jiraData)
    default:
  }
}

module.exports = {
  processChange: processChange
}
