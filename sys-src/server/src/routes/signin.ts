import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import { BadRequestError } from '../errors/bad-request-error'
import { validateRequest } from '../middlewares/validate-request'
import { Password } from '../services/password'
import User from '../model/User'

/**
 * Logs the user in and creates user type specific jwt-token.
 * * @route POST /api/auth/signin
 */
const router = express.Router()

router.post(
  '/api/auth/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('You must supply a password')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body
    const existingUser = await User.findOne({ email })

    /*
     * This code will go through the same process no matter what the user or the password is,
     * allowing the application to return in approximately the same response time. Preventing
     * the attacker to differentiate between a wrong username and a wrong password.
     */

    const passwordsMatch = await Password.compare(
      existingUser ? existingUser.password : 'supersecretpassword',
      password
    )

    if (!existingUser || !passwordsMatch) {
      throw new BadRequestError('Invalid credentials', ['Change email or password.'])
    }

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email
      },
      process.env.JWT_KEY!
    )
    // Store it on session object
    //@ts-ignore
    req.session = {
      jwt: userJwt
    }

    return res.status(200).send({
      userID: existingUser.id,
      email: existingUser.email
    })
  }
)

export { router as signinRouter }
