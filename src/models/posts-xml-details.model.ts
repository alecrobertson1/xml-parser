import { XmlDetails } from "./xml-details.model";

export interface PostsXmlDetails extends XmlDetails {
    firstPost: Date;
    lastPost: Date;
    totalPosts: number;
    totalAcceptedPosts: number;
    avgScore: number;
}