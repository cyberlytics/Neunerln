import { Password } from '../password'

describe('password service', () => {
  it('returns a bcrypt salted hash', async () => {
    const hash = await Password.toHash('supersecretpassword')

    return expect(hash).toMatch(/\$2b\$\d\d\$.*/)
  })

  it('returns a false on wrong supplied password', async () => {
    const hash = await Password.toHash('supersecretpassword')
    const result = await Password.compare('tes', hash)

    return expect(result).toBeFalsy()
  })
})
