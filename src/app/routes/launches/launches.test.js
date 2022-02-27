const request = require('supertest');
const app = require('../../app');
const { mongoConnect, mongoDisConnect } = require('../../services/mongo');

describe('Launches API', () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisConnect();
  });

  describe('Test GET /launches', () => {
    test('It should respond with 200 OK and Content-Type application/json', async () => {
      await request(app)
        .get('/launches')
        .expect(200)
        .expect('Content-Type', /json/);
    });
  });

  describe('Test POST /launches', () => {
    const completeLaunchData = {
      mission: 'Test',
      rocket: 'NASA 001',
      target: 'Kepler-62 f',
      launchDate: 'January 4, 2028',
    };

    const launchDataWithoutDate = {
      mission: 'Test',
      rocket: 'NASA 001',
      target: 'Kepler-62 f',
    };

    const launchDataWithInvalidDate = {
      mission: 'Test',
      rocket: 'NASA 001',
      target: 'Kepler-62 f',
      launchDate: 'Hello',
    };

    test('It should respond with 201 Created', async () => {
      const response = await request(app)
        .post('/launches')
        .send(completeLaunchData)
        .expect('Content-Type', /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);
      expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test('It should catch missing required properties', async () => {
      const response = await request(app)
        .post('/launches')
        .send(launchDataWithoutDate)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: 'Missing required launch properties',
      });
    });

    test('It should catch invalid dates', async () => {
      const response = await request(app)
        .post('/launches')
        .send(launchDataWithInvalidDate)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: 'Invalid launch date',
      });
    });
  });
});
