import * as data from "../User";

const db = require("./db");

beforeAll(async () => await db.connect());

afterEach(async () => await db.clearDatabase());

afterAll(async () => await db.closeDatabase());

describe('add User in database', () => {
  it('should add user to database', async () => {
    const user = await data.createUser(
      "Player1",
      "Player1@test.com",
      "Pass12345"
    )
    expect(user.username).toEqual("Player1");
    expect(user.email).toEqual("Player1@test.com");
    expect(user.password).toEqual("Pass12345");
  })
})

describe('throw error on user creation', () => {
  it('on duplicate username', async () => {
    await data.createUser("Player1", "Player2@test.com", "Pass12345");
    try{
      await data.createUser("Player1", "Player1@test.com", "Pass12345");
    }catch(err:any){
      expect(err).toBeDefined()
    }
  })
  it('on duplicate email', async () => {
    await data.createUser("Player1", "Player1@test.com", "Pass12345");
    try{
      await data.createUser("Player2", "Player1@test.com", "Pass12345")
    }catch(err:any){
      expect(err).toBeDefined()
    }
  })
})

describe('should find User in database', () => {
  it('should find email in database', async () => {
    await data.createUser("Player1", "Player1@test.com", "Pass12345");
    const user = await data.findUserByEmail("Player1@test.com")
    if(user) {
      expect(user.username).toEqual("Player1");
      expect(user.played).toEqual(0);
      expect(user.won).toEqual(0);
    }
  })

  it('should find username in database', async () => {
    await data.createUser("Player1", "Player1@test.com", "Pass12345");
    const user = await data.findUserByUsername("Player1")
    if(user) {
      expect(user.username).toEqual("Player1");
      expect(user.played).toEqual(0);
      expect(user.won).toEqual(0);
    }
  })
})

describe('increase games and wins', () => {
  it('should increase games played', async () => {
    await data.createUser("Player1", "Player1@test.com", "Pass12345");
    const user = await data.increasePlayed("Player1@test.com",);
    expect(user.played).toEqual(1);
    expect(user.won).toEqual(0);
  })
  it('should increase games won', async () => {
    await data.createUser("Player1", "Player1@test.com", "Pass12345");
    const user = await data.increaseWon("Player1@test.com");
    expect(user.won).toEqual(1);
  })
  it('should throw error on increase played', async () => {
    await data.createUser("Player1", "Player1@test.com", "Pass12345");
    try{
      await data.increasePlayed("emailNotInData");
    }catch(err:any){
      expect(err).toBeDefined()
    }
  })
  it('should throw error on increase won', async () => {
    await data.createUser("Player1", "Player1@test.com", "Pass12345");
    try{
      await data.increaseWon("emailNotInData");
    }catch(err:any){
      expect(err).toBeDefined()
    }
  })
})

describe('getUsers()', () => {
  it('should return all users in database', async () => {
    await data.createUser("Player1", "Player1@test.com", "Pass12345");
    await data.createUser("Player2", "Player2@test.com", "Pass12345");
    const users = await data.getUsers()
    expect(users[0].username).toEqual("Player1");
    expect(users[1].username).toEqual("Player2");
  })
})
