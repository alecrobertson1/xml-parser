"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = __importDefault(require("express"));
var xml_parser_controller_1 = require("../controllers/xml-parser.controller");
exports.router = express_1.default.Router();
var xmlParserController = new xml_parser_controller_1.XmlParserController();
exports.router.post('/analyse', function (request, response) {
    xmlParserController.parse(request.body.url)
        .then(function (xmlParsed) { return response.json(xmlParsed); })
        .catch(function () { return response.sendStatus(500); });
});
