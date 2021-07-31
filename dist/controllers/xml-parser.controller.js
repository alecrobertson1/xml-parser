"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlParserController = void 0;
var file_download_service_1 = require("../services/file-download.service");
var xml_parser_service_1 = require("../services/xml-parser.service");
var XmlParserController = /** @class */ (function () {
    function XmlParserController() {
        this.fileDownloadService = new file_download_service_1.FileDownloadService();
        this.xmlParserService = new xml_parser_service_1.XmlParserService();
    }
    XmlParserController.prototype.parse = function (url) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var successfulDownload = function (fileName) {
                var successfulParse = function (xmlParsed) {
                    resolve(xmlParsed);
                };
                var failedParse = function (error) {
                    reject(error);
                };
                _this.xmlParserService.parse(fileName)
                    .then(successfulParse)
                    .catch(failedParse);
            };
            var failedDownload = function (error) {
                reject(error);
            };
            _this.fileDownloadService.download(url)
                .then(successfulDownload)
                .catch(failedDownload);
        });
    };
    return XmlParserController;
}());
exports.XmlParserController = XmlParserController;
