import request from 'supertest'
import User from '../../model/User'
import { app } from '../../app'
import { Password } from '../../services/password'

jest.mock('../../model/User')
jest.mock('../../services/password')
describe('POST /api/auth/signin', () => {
  const userMock = {
    id: '123',
    email: 'test@test.com',
    password: 'hashedpassword',
    set: jest.fn(),
    save: jest.fn()
  }

  beforeEach(() => {
    ;(User.findOne as jest.Mock).mockResolvedValue(userMock)
    ;(Password.compare as jest.Mock).mockImplementation(async (hashedPassword, password) =>
      password === 'password' ? true : false
    )
  })

  it('returns a 400 with an invalid email', async () => {
    await request(app)
      .post('/api/auth/signin')
      .send({
        email: 'notanemail',
        password: 'password'
      })
      .expect(400)
  })

  it('returns a 400 with an invalid password', async () => {
    await request(app)
      .post('/api/auth/signin')
      .send({
        name: 'test@test.com',
        password: ''
      })
      .expect(400)
  })

  it('returns a 400 with missing password and email', async () => {
    await request(app).post('/api/auth/signin').send({}).expect(400)
  })

  it('fails when an incorrect password is supplied', async () => {
    await request(app)
      .post('/api/auth/signin')
      .send({
        name: 'test@test.com',
        password: 'incorrect'
      })
      .expect(400)
  })

  it('responds with a cookie when given valid credentials', async () => {
    process.env.JWT_KEY = 'test_jwt_key'
    const response = await request(app)
      .post('/api/auth/signin')
      .send({
        name: 'test@test.com',
        password: 'password'
      })
      .expect(200)

    expect(response.get('Set-Cookie')).toBeDefined()
  })
})
