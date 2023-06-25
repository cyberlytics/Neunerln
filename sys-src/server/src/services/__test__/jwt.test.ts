import { JWT } from '../jwt'
import { BadRequestError } from '../../errors/bad-request-error'
import { InternalServerError } from '../../errors/interal-server-error'

describe('JWT Service', () => {
  beforeAll(() => {
    process.env.JWT_KEY = 'something'
  })

  it('returns a token', async () => {
    const token = await JWT.createToken({ test: 'test' })
    return expect(token).toBeDefined()
  })

  it('returns error jwt is malformed', async () => {
    const token = await JWT.createToken({ test: 'test' })
    const malformed = token?.slice(0, token.length - 2) + 'a'

    expect(token).not.toEqual(malformed)
    return expect(JWT.verifyToken(malformed)).rejects.toThrow(BadRequestError)
  })

  it('returns error jwt is expired', async () => {
    const token = await JWT.createToken({ test: 'test' }, '1ms')
    await new Promise((r) => setTimeout(r, 50))
    if (!token) {
      throw new Error('Something went wrong with the token!')
    }

    return expect(JWT.verifyToken(token)).rejects.toThrow(BadRequestError)
  })

  it('returns same decoded object', async () => {
    const payload = { test: 'test' }
    const token = await JWT.createToken(payload)
    if (token) {
      const obj = await JWT.verifyToken(token)
      return expect(obj).toMatchObject(payload)
    } else {
      return
    }
  })

  it('returns error jwt is malformed', async () => {
    const token = await JWT.createToken({ test: 'test' })
    const malformed = token?.slice(0, token.length - 2) + 'a'

    expect(token).not.toEqual(malformed)
    return expect(JWT.verifyToken(malformed)).rejects.toThrow(BadRequestError)
  })

  it('returns error jwt is expired', async () => {
    const token = await JWT.createToken({ test: 'test' }, '1ms')
    await new Promise((r) => setTimeout(r, 50))
    if (!token) {
      throw new Error('Something went wrong with the token!')
    }

    return expect(JWT.verifyToken(token)).rejects.toThrow(BadRequestError)
  })

  it('returns same decoded object', async () => {
    const payload = { test: 'test' }
    const token = await JWT.createToken(payload)
    if (token) {
      const obj = await JWT.verifyToken(token)
      return expect(obj).toMatchObject(payload)
    } else {
      return
    }
  })

  it('rejects Token because process.env.JWT_KEY is missing', async () => {
    delete process.env.JWT_KEY
    expect(JWT.createToken({})).rejects.toThrow(InternalServerError)
  })
})
