import * as https from 'https';
import * as fs from 'fs';

import { ClientRequest, IncomingMessage } from 'http';

export class FileDownloadService {
    readonly fileName: string = "tmp.xml";
    readonly invalidUrlError: string = "INVALID_URL";
    readonly responseError: string = "RESPONSE_ERROR";

    public download(url: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {

            if (!this.stringIsAValidUrl(url)) {
                reject(new Error(this.invalidUrlError));
            }

            const downloadedFile = fs.createWriteStream(this.fileName);

            const request: ClientRequest = https.get(url, (response: IncomingMessage) => {
                if (response.statusCode !== 200) {
                    reject(new Error(this.responseError));
                }

                response.pipe(downloadedFile);
            });

            request.on('error', (error: Error) => {
                reject(error);
            });

            downloadedFile.on('finish', () => {
                resolve(this.fileName);
            });

            downloadedFile.on('error', (error: Error) => {
                reject(error);
            });
        });
    }

    private stringIsAValidUrl (url: string) {
        try {
          new URL(url);
          return true;
        } catch (err) {
          return false;
        }
    }

}