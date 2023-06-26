import jwt from 'jsonwebtoken'
import { BadRequestError } from '../errors/bad-request-error'
import { InternalServerError } from '../errors/interal-server-error'

export class JWT {
  private static expiresIn: string = '2s'
  /**
   * Creates a JWT-Token with HS256 algorithmen and signs it
   * with the environment variable JWT_KEY.
   * @param payload - The date to be embedded in the jwt token
   * @param expiresIn - The expiration time
   * @returns Promise<string|undefined>
   */
  static async createToken(
    payload: object,
    expiresIn?: string | number
  ): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        process.env.JWT_KEY!,
        {
          expiresIn: expiresIn || this.expiresIn
        },
        (err: Error | null, encoded: string | undefined) => {
          if (err) {
            reject(new InternalServerError('Something went wrong with the JWT-Token'))
          }
          resolve(encoded)
        }
      )
    })
  }

  /**
   * Asynchronously verify given token using a secret key to
   * get a decoded token. Uses the standard algorithm HS256.
   * @param token - The token to verify
   * @returns Promise<object | undefined>
   */
  static async verifyToken(token: string): Promise<object | undefined> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_KEY!, function (err, decode: any) {
        if (err?.name === 'TokenExpiredError') {
          reject(new BadRequestError('Token has expired!', ['Please restart the process.']))
        }

        if (err?.name === 'JsonWebTokenError') {
          reject(new BadRequestError('That JWT is malformed!', ['Please restart the process.']))
        }

        resolve(decode)
      })
    })
  }
}
