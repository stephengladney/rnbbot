"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkforStagnants = exports.getJiraCard = exports.addToStagnants = exports.findStagnants = exports.removeFromStagnants = exports.processWebhook = exports.composeAndSendMessage = void 0;
var moment = require("moment");
var axios = require("axios");
require("dotenv").config();
var _a = require("./numbers"), hours = _a.hours, isPast = _a.isPast;
var _b = require("./slack"), isWithinSlackHours = _b.isWithinSlackHours, sendEphemeral = _b.sendEphemeral, sendMessage = _b.sendMessage;
var _c = require("./notifications"), isNotifyEnabled = _c.isNotifyEnabled, notifications = _c.notifications;
var jiraSettings = require("../../settings").jiraSettings;
var findPullRequests = require("./github").findPullRequests;
var _d = require("../../team"), designer = _d.designer, findTeamMemberByFullName = _d.findTeamMemberByFullName, qaEngineer = _d.qaEngineer, productManager = _d.productManager, slackChannel = _d.slackChannel, teamName = _d.teamName;
function composeAndSendMessage(_a) {
    var cardData = _a.cardData, event = _a.event;
    var whoReceivesEphemeral = function (status) {
        switch (status) {
            case "Ready for QA":
                return qaEngineer;
            case "Ready for Acceptance":
                return productManager;
            case "Ready for Design Review":
                return designer;
            default:
                return findTeamMemberByFullName(cardData.assignee);
        }
    };
    var methodFromSettings = jiraSettings[cardData.currentStatus].method;
    var message = notifications(cardData)[event][methodFromSettings]();
    methodFromSettings === "channel" &&
        sendMessage({
            channel: slackChannel,
            message: message,
        });
    methodFromSettings === "ephemeral" &&
        sendEphemeral({
            channel: slackChannel,
            message: message,
            user: whoReceivesEphemeral(cardData.currentStatus),
        });
}
exports.composeAndSendMessage = composeAndSendMessage;
function processWebhook(_a) {
    var _b;
    var body = _a.body, stagnantCards = _a.stagnantCards;
    return __awaiter(this, void 0, void 0, function () {
        var fieldThatChanged, teamAssigned, foundPullRequests, cardData;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    fieldThatChanged = ((_b = body === null || body === void 0 ? void 0 : body.changelog) === null || _b === void 0 ? void 0 : _b.items[0].fieldId) || "";
                    teamAssigned = body.issue.fields.customfield_10025
                        ? body.issue.fields.customfield_10025.value
                        : "No team assigned";
                    if (fieldThatChanged !== "status" || teamAssigned !== teamName)
                        return [2 /*return*/];
                    return [4 /*yield*/, findPullRequests(body.issue.key.substr(3))];
                case 1:
                    foundPullRequests = _c.sent();
                    cardData = {
                        assignee: body.issue.fields.assignee
                            ? findTeamMemberByFullName(body.issue.fields.assignee.displayName)
                            : { firstName: "No", lastName: "assignee", slackHandle: "notassigned" },
                        cardNumber: body.issue.key,
                        cardTitle: body.issue.fields.summary,
                        currentStatus: body.changelog.items[0].toString,
                        previousStatus: body.changelog.items[0].fromString,
                        pullRequests: foundPullRequests.some(function (pr) { return pr.includes("Error"); })
                            ? []
                            : foundPullRequests,
                        teamAssigned: teamAssigned,
                    };
                    removeFromStagnants({
                        cardData: cardData,
                        stagnantCards: stagnantCards,
                    });
                    isNotifyEnabled({ status: cardData.currentStatus }).notifyOnEntry &&
                        composeAndSendMessage({ cardData: cardData, event: "entry" });
                    isNotifyEnabled({ status: cardData.currentStatus }).monitorForStagnant &&
                        addToStagnants({
                            cardData: cardData,
                            stagnantCards: stagnantCards,
                        });
                    return [2 /*return*/];
            }
        });
    });
}
exports.processWebhook = processWebhook;
function removeFromStagnants(_a) {
    var cardData = _a.cardData, stagnantCards = _a.stagnantCards;
    var cardIndex = stagnantCards.findIndex(function (card) { return card.cardNumber === cardData.cardNumber; });
    if (cardIndex !== -1)
        stagnantCards.splice(cardIndex, 1);
}
exports.removeFromStagnants = removeFromStagnants;
function findStagnants(query, stagnantCards) {
    var queryType = isNaN(Number(query)) ? "title" : "number";
    var match;
    if (queryType === "title") {
        match = stagnantCards.filter(function (card) {
            return card.cardTitle.toLowerCase().includes(String(query).toLowerCase());
        });
    }
    else if (queryType === "number") {
        match = stagnantCards.filter(function (card) {
            return String(card.cardNumber).includes(String(query));
        });
    }
    return match;
}
exports.findStagnants = findStagnants;
function addToStagnants(_a) {
    var cardData = _a.cardData, stagnantCards = _a.stagnantCards;
    var currentStatus = cardData.currentStatus;
    if (!!jiraSettings[currentStatus].monitorForStagnant) {
        var timeStamp = Date.now();
        stagnantCards.push(__assign(__assign({}, cardData), { alertCount: 1, nextAlertTime: timeStamp + hours(2), lastColumnChangeTime: timeStamp }));
    }
}
exports.addToStagnants = addToStagnants;
function getJiraCard(cardNumber) {
    return axios.get("https://salesloft.atlassian.net/rest/api/2/issue/" + cardNumber, {
        headers: {
            Authorization: "Basic " + process.env.JIRA_TOKEN,
            header: "Accept: application/json",
        },
    });
}
exports.getJiraCard = getJiraCard;
function checkforStagnants(arr) {
    if (!isWithinSlackHours())
        return;
    arr.forEach(function (card) {
        if (isPast(card.nextAlertTime)) {
            card.alertCount && card.alertCount++;
            card.nextAlertTime = Date.now() + hours(2);
            card.age = moment().from(card.lastColumnChangeTime, true);
            composeAndSendMessage({ cardData: card, event: "stagnant" });
        }
    });
}
exports.checkforStagnants = checkforStagnants;
// module.exports = {
//   addToStagnants,
//   checkforStagnants,
//   findStagnants,
//   getJiraCard,
//   hours,
//   processWebhook,
//   removeFromStagnants,
// }
