require("dotenv").config();
const axios = require("axios");

const sendMessage = (channel, message) => {
  axios({
    method: "post",
    url: "https://slack.com/api/chat.postMessage",
    headers: {
      Authorization: `Bearer ${process.env.SLACK_TOKEN}`
    },
    contentType: "application/x-www-form-urlencoded",
    data: { channel: channel, text: message }
  });
};

const notify = {
  readyForQA: (channel, jiraCard, qaEngineerSlackHandle) => {
    sendMessage(
      channel,
      `:in_qa: [<https://salesloft.atlassian.net/browse/${jiraCard}|${jiraCard}>] is *ready for QA* <@${qaEngineerSlackHandle}>`
    );
  },
  readyForReview: (channel, jiraCard) => {
    sendMessage(
      channel,
      `:eyes: [<https://salesloft.atlassian.net/browse/${jiraCard}|${jiraCard}>] is *ready for review* <!here|here>`
    );
  },
  readyForMerge: (channel, jiraCard, engineerSlackHandle) => {
    sendMessage(
      channel,
      `:merged: [<https://salesloft.atlassian.net/browse/${jiraCard}|${jiraCard}>] is *ready for merge* <@${engineerSlackHandle}>`
    );
  }
};

module.exports = {
  sendMessage: (channel, message) => sendMessage(channel, message),
  notify: notify
};
