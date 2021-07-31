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
exports.XmlParserService = void 0;
var fs = __importStar(require("fs"));
var sax = __importStar(require("sax"));
var XmlParserService = /** @class */ (function () {
    function XmlParserService() {
        // The date the furthest in the future we can represent.
        // So when we do the initial date comparison, we have something to compare against
        // that will ensure we set the (first) date in the XML to be the first post date.
        this.firstPost = new Date(8640000000000000);
        // See above - but it is flipped as we now want to start with the oldest date.
        this.lastPost = new Date(-8640000000000000);
        this.totalPosts = 0;
        this.totalScore = 0;
    }
    XmlParserService.prototype.parse = function (filePath) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var stream = fs.createReadStream(filePath);
            var parser = sax.createStream(true);
            stream.pipe(parser);
            parser.on('attribute', function (attribute) { return _this.parseAttribute(attribute); });
            stream.on('close', function () {
                var xmlDetails = {
                    firstPost: _this.firstPost,
                    lastPost: _this.lastPost,
                    totalPosts: _this.totalPosts,
                    avgScore: _this.totalScore / _this.totalPosts
                };
                resolve({
                    analysisDate: new Date(),
                    details: xmlDetails
                });
            });
            stream.on('error', function (error) { return reject(error); });
        });
    };
    XmlParserService.prototype.parseAttribute = function (attribute) {
        var attributeName = attribute.name.toUpperCase();
        switch (attributeName) {
            case 'id'.toUpperCase(): {
                this.totalPosts++;
                break;
            }
            case 'creationdate'.toUpperCase(): {
                var attributeDate = new Date(attribute.value);
                if (attributeDate < this.firstPost) {
                    this.firstPost = new Date(attribute.value);
                }
                ;
                if (attributeDate > this.lastPost) {
                    this.lastPost = new Date(attribute.value);
                }
                ;
                break;
            }
            case 'score'.toUpperCase(): {
                this.totalScore += Number.parseInt(attribute.value);
                break;
            }
        }
    };
    return XmlParserService;
}());
exports.XmlParserService = XmlParserService;
