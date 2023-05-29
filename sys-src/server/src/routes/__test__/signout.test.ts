import request from 'supertest'
import { app } from '../../app'

describe('/api/auth/signout', () => {
  test('should clear session and respond with status 200', async () => {
    const response: any = await request(app)
      .post('/api/auth/signout')
      // set cookie after log in
      .set('Cookie', ['{}'])
      .expect(200)

    // Depending on how your route is set up, the session may be an empty object instead of null

    expect(response.get('Set-Cookie')[0]).toBeDefined()
    expect(response.get('Set-Cookie')[0]).toContain('session=;')
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ message: 'Successful signed out!' })
  })
})
