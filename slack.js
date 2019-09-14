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

const truncateTitle = title => {
  return String(title).length <= 50
    ? title
    : `${String(title).substr(0, 50)}...`;
};

const notify = {
  readyForQA: (channel, jiraCard, cardTitle, qaEngineerSlackHandle) => {
    sendMessage(
      channel,
      `:in_qa: [<https://salesloft.atlassian.net/browse/${jiraCard}|${jiraCard}>] \`${truncateTitle(
        cardTitle
      )}\` is *ready for QA* <@${qaEngineerSlackHandle}>`
    );
  },
  readyForReview: (channel, jiraCard, cardTitle) => {
    sendMessage(
      channel,
      `:eyes: [<https://salesloft.atlassian.net/browse/${jiraCard}|${jiraCard}>] [_${truncateTitle(
        cardTitle
      )}_] is *ready for review* <!here|here>`
    );
  },
  readyForMerge: (channel, jiraCard, cardTitle, engineerSlackHandle) => {
    sendMessage(
      channel,
      `:merged: [<https://salesloft.atlassian.net/browse/${jiraCard}|${jiraCard}>] [_${truncateTitle(
        cardTitle
      )}_] is *ready for merge* <@${engineerSlackHandle}>`
    );
  }
};

module.exports = {
  sendMessage: (channel, message) => sendMessage(channel, message),
  notify: notify
};
