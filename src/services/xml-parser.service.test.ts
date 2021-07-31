import fs from 'fs';
import sax from 'sax';

import { XmlParserService } from './xml-parser.service';

let mockReadStream = {
    on: jest.fn().mockImplementation((event: string, handler: () => void) => {
      if (event === 'close') {
        handler();
      }
    }),
    pipe: jest.fn()
};

fs.createReadStream = jest.fn().mockImplementation((filePath: string) => {
    return mockReadStream;
});

let mockSaxStream = {
    on: jest.fn().mockImplementation((event: string, handler: (attribute: any) => void) => {
      if (event === 'attribute') {
        handler({  
            name: "score",
            value: "50"
        });
      }
    })
};

sax.createStream = jest.fn().mockImplementation((strict: boolean) => {
    return mockSaxStream;
});

test("should reject with an error when there is an error with the stream process", () => {
    mockReadStream = {
        on: jest.fn().mockImplementation((event: string, handler: (error: Error) => void) => {
          if (event === 'error') {
            handler(new Error("STREAM_ERROR"));
          }
        }),
        pipe: jest.fn()
    };

    const xmlParserService: XmlParserService = new XmlParserService();

    const filePath = "filePath";

    return expect(xmlParserService.parse(filePath)).rejects.toThrow('STREAM_ERROR');
});

test("should resolve when the parse is successful", () => {
    mockReadStream = {
        on: jest.fn().mockImplementation((event: string, handler: () => void) => {
          if (event === 'close') {
            handler();
          }
        }),
        pipe: jest.fn()
    };

    const xmlParserService: XmlParserService = new XmlParserService();

    const filePath = "filePath";

    return expect(xmlParserService.parse(filePath)).resolves.toEqual(expect.objectContaining({
        analysisDate: expect.any(Date),
        details: expect.objectContaining({ avgScore: expect.any(Number) })
    }))
});