import request from 'supertest'
import mongoose from 'mongoose'
import { app } from '../../app'

// model
import User from '../../model/User'

// mocks

// Create a mock function for mongoose.connect
mongoose.connect = jest.fn()
jest.mock('../../model/User', () => ({
  findOne: jest.fn(),
  create: jest.fn()
}))

const mockedUser = User as jest.Mocked<typeof User>

describe('POST /api/auth/signup', () => {
  it('should return 400 Bad Request if email is invalid', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'invalidemail',
        password: 'ValidPass123',
        username: 'validUsername'
      })
      .expect(400)
  })

  it('should return 400 Bad Request if password is invalid', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'test@email.com',
        password: '123',
        username: 'validUsername'
      })
      .expect(400)
  })

  it('should return 400 Bad Request if username is empty', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'test@email.com',
        password: 'ValidPass123',
        username: ''
      })
      .expect(400)
  })

  it('should return 400 Bad Request if email or username is taken', async () => {
    mockedUser.findOne.mockResolvedValue({}) // Mock a returned user

    await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'test@email.com',
        password: 'ValidPass123',
        username: 'validUsername'
      })
      .expect(400)
  })

  it('should return 201 Created if signup is successful', async () => {
    mockedUser.findOne.mockResolvedValue(null) // Mock no returned user
    mockedUser.create.mockResolvedValue({} as any) // Mock a successful create

    await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'test@gmail.com',
        password: 'ValidPass123',
        username: 'validUsername'
      })
      .expect(201)
  })

  it('should return 500 Internal Server Error if there is a server error', async () => {
    mockedUser.findOne.mockResolvedValue(null) // Mock no returned user
    mockedUser.create.mockRejectedValue(new Error()) // Mock a failed create

    await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'test@email.com',
        password: 'ValidPass123',
        username: 'validUsername'
      })
      .expect(500)
  })
})
