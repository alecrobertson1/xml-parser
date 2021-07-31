import express from 'express';
import { Request, Response } from 'express';

import { XmlParserController } from '../controllers/xml-parser.controller';
import { XmlParsed } from '../models/xml-parsed.model';

export const router = express.Router();

const xmlParserController: XmlParserController = new XmlParserController();

router.post('/analyse', (request: Request, response: Response) => {
    xmlParserController.parse(request.body.url)
        .then((xmlParsed: XmlParsed) => { return response.json(xmlParsed) })
        .catch(() => { return response.sendStatus(500) });
});