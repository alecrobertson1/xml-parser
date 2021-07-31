import https from 'https';
import fs from 'fs';

import { FileDownloadService } from "./file-download.service";

let mockWriteStream = {
    on: jest.fn().mockImplementation((event: string, handler: () => void) => {
      if (event === 'finish') {
        handler();
      }
    })
};

fs.createWriteStream = jest.fn().mockImplementation((fileName: string) => {
    return mockWriteStream;
});

test("should reject with an error when an invalid URL is provided", () => {
    const fileDownloadService: FileDownloadService = new FileDownloadService();

    const invalidUrl = "invalidUrl";

    return expect(fileDownloadService.download(invalidUrl)).rejects.toThrow('INVALID_URL');
});

test("should reject with an error when the status code is not 200", () => {
    https.get = jest.fn().mockImplementation((url, response) => {
        response({ statusCode: 500 });
    });

    const fileDownloadService: FileDownloadService = new FileDownloadService();

    const validUrl = "https://www.apple.com";

    return fileDownloadService.download(validUrl).catch((error: Error) => expect(error.message).toBe("RESPONSE_ERROR"));
});

test("should reject with an error when there is a problem with the download process", () => {
    mockWriteStream = {
        on: jest.fn().mockImplementation((event: string, handler: (error: Error) => void) => {
          if (event === 'error') {
            handler(new Error("DOWNLOAD_ERROR"));
          }
        })
    };

    https.get = jest.fn().mockImplementation((url, response) => {
        response({ 
            statusCode: 200,
            pipe: jest.fn()
        });

        return {
            on: jest.fn()
        }
    });

    const fileDownloadService: FileDownloadService = new FileDownloadService();

    const validUrl = "https://www.apple.com";

    return fileDownloadService.download(validUrl).catch((error: Error) => expect(error.message).toBe("DOWNLOAD_ERROR"));
});

test("should resolve when the download is successful", () => {
    mockWriteStream = {
        on: jest.fn().mockImplementation((event: string, handler: () => void) => {
          if (event === 'finish') {
            handler();
          }
        })
    };

    https.get = jest.fn().mockImplementation((url, response) => {
        response({ 
            statusCode: 200,
            pipe: jest.fn()
        });

        return {
            on: jest.fn()
        }
    });

    const fileDownloadService: FileDownloadService = new FileDownloadService();

    const validUrl = "https://www.apple.com";

    return fileDownloadService.download(validUrl).then((fileName: string) => expect(fileName).toBe("tmp.xml"));
});