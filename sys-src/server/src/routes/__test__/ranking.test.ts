import request from 'supertest'
import { app } from '../../app'
import * as data from "../../database/User";

const db = require("../../database/__test__/db");

beforeAll(async () => await db.connect());

afterEach(async () => await db.clearDatabase());

afterAll(async () => await db.closeDatabase());

describe('/api/rankings', () => {
  it('should get ranking from database and respond with status 201', async () => {
    await data.createUser("TestUser", "TestMail", "TestPass");
    await data.createUser("TestUser2", "TestMail2", "TestPass2");
    await data.increasePlayed("TestMail2");
    await data.increaseWon("TestMail2");

    const response: any = await request(app)
      .get('/api/rankings')

    expect(response.status).toBe(201)
    expect(response.body).toEqual({ message: 'Successfully retrieved all Rankings!',
      ranking: [
        { rank: 1, username: 'TestUser2', played: 1, wins: 1, winrate: 100 },
        { rank: 2, username: 'TestUser', played: 0, wins: 0, winrate: 0 }
      ]})
  })
})
