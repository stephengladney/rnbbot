const {
  notify: {
    readyForAcceptance,
    readyForDesignReview,
    readyForMerge,
    readyForQA,
    readyForReview
  }
} = require("./slack")

const r4DesignReview = "Design Review"
const inDevelopment = "In Development"
const r4CodeReview = "Ready for Code Review"
const r4Qa = "Ready for QA"
const r4Acceptance = "Ready for Acceptance"
const r4Merge = "Ready for Merge"
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

  if (newStatus == r4CodeReview) readyForReview(jiraData)
  if (newStatus == r4Qa) readyForQA(jiraData)
  if (newStatus == r4DesignReview) readyForDesignReview(jiraData)
  if (newStatus == r4Acceptance) readyForAcceptance(jiraData)
  if (newStatus == r4Merge) readyForMerge(jiraData)
}

module.exports = {
  processChange: processChange
}
