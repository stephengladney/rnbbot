"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config({ path: "../.env" });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var jira_1 = require("./lib/jira");
var app = express_1.default();
var stagnantCards = [];
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(require("./routes"));
var statusPoller = setInterval(function () {
    jira_1.checkforStagnants(stagnantCards);
}, 60000);
app.listen(Number(process.env.PORT) || 5000, function () {
    console.log("RnBot server is now running!");
});
