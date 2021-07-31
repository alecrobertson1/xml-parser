"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var sax_1 = __importDefault(require("sax"));
var xml_parser_service_1 = require("./xml-parser.service");
var mockReadStream = {
    on: jest.fn().mockImplementation(function (event, handler) {
        if (event === 'close') {
            handler();
        }
    }),
    pipe: jest.fn()
};
fs_1.default.createReadStream = jest.fn().mockImplementation(function (filePath) {
    return mockReadStream;
});
var mockSaxStream = {
    on: jest.fn().mockImplementation(function (event, handler) {
        if (event === 'attribute') {
            handler({
                name: "score",
                value: "50"
            });
        }
    })
};
sax_1.default.createStream = jest.fn().mockImplementation(function (strict) {
    return mockSaxStream;
});
test("should reject with an error when there is an error with the stream process", function () {
    mockReadStream = {
        on: jest.fn().mockImplementation(function (event, handler) {
            if (event === 'error') {
                handler(new Error("STREAM_ERROR"));
            }
        }),
        pipe: jest.fn()
    };
    var xmlParserService = new xml_parser_service_1.XmlParserService();
    var filePath = "filePath";
    return expect(xmlParserService.parse(filePath)).rejects.toThrow('STREAM_ERROR');
});
test("should resolve when the parse is successful", function () {
    mockReadStream = {
        on: jest.fn().mockImplementation(function (event, handler) {
            if (event === 'close') {
                handler();
            }
        }),
        pipe: jest.fn()
    };
    var xmlParserService = new xml_parser_service_1.XmlParserService();
    var filePath = "filePath";
    return expect(xmlParserService.parse(filePath)).resolves.toEqual(expect.objectContaining({
        analysisDate: expect.any(Date),
        details: expect.objectContaining({ avgScore: expect.any(Number) })
    }));
});
