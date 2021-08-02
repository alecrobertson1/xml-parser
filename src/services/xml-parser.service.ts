import * as fs from 'fs';
import * as sax from 'sax';

import { PostsXmlDetails } from '../models/posts-xml-details.model';
import { XmlParsed } from '../models/xml-parsed.model';

export class XmlParserService {
    // The date the furthest in the future we can represent.
    // So when we do the initial date comparison, we have something to compare against
    // that will ensure we set the (first) date in the XML to be the first post date.
    private firstPost: Date = new Date(8640000000000000);

    // See above - but it is flipped as we now want to start with the oldest date.
    private lastPost: Date = new Date(-8640000000000000);

    private totalPosts: number = 0;
    private totalScore: number = 0;

    private totalAcceptedPosts: number = 0;

    public parse(filePath: string): Promise<XmlParsed> {
        return new Promise<XmlParsed>((resolve, reject) => {
            let stream = fs.createReadStream(filePath);

            let parser = sax.createStream(true);

            stream.pipe(parser);

            parser.on('attribute', (attribute) => this.parseAttribute(attribute));

            stream.on('close', () => {
                let xmlDetails: PostsXmlDetails = <PostsXmlDetails> {
                    firstPost: this.firstPost,
                    lastPost: this.lastPost,
                    totalPosts: this.totalPosts,
                    totalAcceptedPosts: this.totalAcceptedPosts,
                    avgScore: this.totalScore / this.totalPosts
                }
    
                resolve(<XmlParsed>{
                    analysisDate: new Date(),
                    details: xmlDetails
                });
            });

            stream.on('error', (error: Error) => reject(error));
        });
    }

    private parseAttribute(attribute: any) {
        const attributeName = attribute.name.toUpperCase();

        switch(attributeName) {
            case 'id'.toUpperCase(): {
                this.totalPosts++;

                break;
            }
            case 'creationdate'.toUpperCase(): {
                const attributeDate = new Date(attribute.value);

                if (attributeDate < this.firstPost) {
                    this.firstPost = new Date(attribute.value);
                };
        
                if (attributeDate > this.lastPost) {
                    this.lastPost = new Date(attribute.value);
                };

                break;
            }
            case 'score'.toUpperCase(): {
                this.totalScore += Number.parseInt(attribute.value);

                break;
            }
            case 'acceptedanswerid'.toUpperCase(): {
                this.totalAcceptedPosts++;

                break;
            }
        }
    }
}