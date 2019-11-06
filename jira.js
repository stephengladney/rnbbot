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

  if (newStatus == readyForCodeReview) readyForReview(jiraData)
  if (newStatus == readyForQa) readyForQA(jiraData)
  if (newStatus == designReview) readyForDesignReview(jiraData)
  if (newStatus == readyForAcceptance) readyForAcceptance(jiraData)
  if (newStatus == readyForMerge) readyForMerge(jiraData)
}

module.exports = {
  processChange: processChange
}
