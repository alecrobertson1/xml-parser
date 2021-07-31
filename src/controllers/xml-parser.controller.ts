import { XmlParsed } from '../models/xml-parsed.model';

import { FileDownloadService } from '../services/file-download.service';
import { XmlParserService } from "../services/xml-parser.service";

export class XmlParserController {
    private fileDownloadService: FileDownloadService = new FileDownloadService();
    private xmlParserService: XmlParserService = new XmlParserService();

    public parse(url: string): Promise<XmlParsed> {
        return new Promise<XmlParsed>((resolve, reject) => {
            const successfulDownload = (fileName: string) => {
                const successfulParse = (xmlParsed: XmlParsed) => {
                    resolve(xmlParsed);
                }

                const failedParse = (error: Error) => {
                    reject(error);
                }

                this.xmlParserService.parse(fileName)
                    .then(successfulParse)
                    .catch(failedParse);
            }

            const failedDownload = (error: Error) => { 
                reject(error);
            }
    
            this.fileDownloadService.download(url)
                .then(successfulDownload)
                .catch(failedDownload);
        });
    }
}