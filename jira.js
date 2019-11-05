const slack = require("./slack")
const status = {
  inDevelopment: "In Development",
  readyForCodeReview: "Ready for Code Review",
  readyForQa: "Ready for QA",
  readyForAcceptance: "Ready for Acceptance",
  readyForMerge: "Ready for Merge",
  merged: {
    newStatus: "Done",
    oldStatus: "Merged"
  },
  GA: "GA"
}
function processChange({
  jiraCard,
  cardTitle,
  oldStatus,
  newStatus,
  assignee
}) {
  if (
    oldStatus == status.inDevelopment &&
    newStatus == "Ready for Code Review"
  ) {
    slack.notify.readyForReview({
      jiraCard: jiraCard
    })
  }
}
