import request from 'supertest';
import nock from 'nock';

import app from '../src/app';

it('should parse a valid XML file at a valid URL', async () => {
    nock('https://local.domain')
    .get('/posts.xml')
    .replyWithFile(200, "./e2e/test-posts.xml", {
        'Content-Type': 'application/xml'
});

    const response = await request(app)
        .post('/analyse')
        .send({
            url: 'https://local.domain/posts.xml'
        });

    expect(response.body).toHaveProperty('analysisDate');
    expect(response.body).toHaveProperty('details');
});

it('should fail gracefully if there is any problem', async () => {
    nock('https://local.domain')
    .get('/posts.xml')
    .replyWithError("ERROR_MESSAGE");

    jest.setTimeout(10000);

    const response = await request(app)
        .post('/analyse')
        .send({
            url: 'https://local.domain/posts.xml'
        });
});