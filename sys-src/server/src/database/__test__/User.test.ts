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
    try{
      await data.createUser("Player1", "Player2@test.com", "Pass12345");
      await data.createUser("Player1", "Player1@test.com", "Pass12345");
    }catch(err:any){
      expect(err).toBeDefined()
    }
  })
  it('on duplicate email', async () => {
    try{
      await data.createUser("Player1", "Player1@test.com", "Pass12345");
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
