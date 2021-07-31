"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileDownloadService = void 0;
var https = __importStar(require("https"));
var fs = __importStar(require("fs"));
var FileDownloadService = /** @class */ (function () {
    function FileDownloadService() {
        this.fileName = "tmp.xml";
        this.invalidUrlError = "INVALID_URL";
        this.responseError = "RESPONSE_ERROR";
    }
    FileDownloadService.prototype.download = function (url) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this.stringIsAValidUrl(url)) {
                reject(new Error(_this.invalidUrlError));
            }
            var downloadedFile = fs.createWriteStream(_this.fileName);
            var request = https.get(url, function (response) {
                if (response.statusCode !== 200) {
                    reject(new Error(_this.responseError));
                }
                response.pipe(downloadedFile);
            });
            request.on('error', function (error) {
                reject(error);
            });
            downloadedFile.on('finish', function () {
                resolve(_this.fileName);
            });
            downloadedFile.on('error', function (error) {
                reject(error);
            });
        });
    };
    FileDownloadService.prototype.stringIsAValidUrl = function (url) {
        try {
            new URL(url);
            return true;
        }
        catch (err) {
            return false;
        }
    };
    return FileDownloadService;
}());
exports.FileDownloadService = FileDownloadService;
