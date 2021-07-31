"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var routes_1 = require("./routes/routes");
var app = express_1.default();
app.use(express_1.default.json());
app.use(routes_1.router);
module.exports = app;
