"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var https_1 = __importDefault(require("https"));
var fs_1 = __importDefault(require("fs"));
var file_download_service_1 = require("./file-download.service");
var mockWriteStream = {
    on: jest.fn().mockImplementation(function (event, handler) {
        if (event === 'finish') {
            handler();
        }
    })
};
fs_1.default.createWriteStream = jest.fn().mockImplementation(function (fileName) {
    return mockWriteStream;
});
test("should reject with an error when an invalid URL is provided", function () {
    var fileDownloadService = new file_download_service_1.FileDownloadService();
    var invalidUrl = "invalidUrl";
    return expect(fileDownloadService.download(invalidUrl)).rejects.toThrow('INVALID_URL');
});
test("should reject with an error when the status code is not 200", function () {
    https_1.default.get = jest.fn().mockImplementation(function (url, response) {
        response({ statusCode: 500 });
    });
    var fileDownloadService = new file_download_service_1.FileDownloadService();
    var validUrl = "https://www.apple.com";
    return fileDownloadService.download(validUrl).catch(function (error) { return expect(error.message).toBe("RESPONSE_ERROR"); });
});
test("should reject with an error when there is a problem with the download process", function () {
    mockWriteStream = {
        on: jest.fn().mockImplementation(function (event, handler) {
            if (event === 'error') {
                handler(new Error("DOWNLOAD_ERROR"));
            }
        })
    };
    https_1.default.get = jest.fn().mockImplementation(function (url, response) {
        response({
            statusCode: 200,
            pipe: jest.fn()
        });
        return {
            on: jest.fn()
        };
    });
    var fileDownloadService = new file_download_service_1.FileDownloadService();
    var validUrl = "https://www.apple.com";
    return fileDownloadService.download(validUrl).catch(function (error) { return expect(error.message).toBe("DOWNLOAD_ERROR"); });
});
test("should resolve when the download is successful", function () {
    mockWriteStream = {
        on: jest.fn().mockImplementation(function (event, handler) {
            if (event === 'finish') {
                handler();
            }
        })
    };
    https_1.default.get = jest.fn().mockImplementation(function (url, response) {
        response({
            statusCode: 200,
            pipe: jest.fn()
        });
        return {
            on: jest.fn()
        };
    });
    var fileDownloadService = new file_download_service_1.FileDownloadService();
    var validUrl = "https://www.apple.com";
    return fileDownloadService.download(validUrl).then(function (fileName) { return expect(fileName).toBe("tmp.xml"); });
});
