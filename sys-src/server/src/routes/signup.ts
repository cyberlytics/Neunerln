import express, { Request, Response } from 'express'
import { body } from 'express-validator'
<<<<<<< Updated upstream

// configs
import { BCRYPT_MAX_LENGTH, BCRYPT_MIN_LENGTH, passwordRegex } from '../config/auth.config'

// models
import User from '../model/User'
import { findUserByEmail, findUserByUsername } from '../database/User'

// middlewares
import { validateRequest } from '../middlewares/validate-request'

// errors
import { BadRequestError } from '../errors/bad-request-error'
import { InternalServerError } from '../errors/interal-server-error'

// services
import { Password } from '../services/password'

=======
//import { BadRequestError } from '../errors/bad-request-error'
import { validateRequest } from '../middlewares/validate-request'
import { BCRYPT_MAX_LENGTH, BCRYPT_MIN_LENGTH, passwordRegex } from '../config/auth.config'
//import { Password } from '../services/password'

>>>>>>> Stashed changes
const router = express.Router()

router.post(
  '/api/auth/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: BCRYPT_MIN_LENGTH, max: BCRYPT_MAX_LENGTH })
      .matches(passwordRegex)
      .withMessage('Password must be between 8 and 64 characters long.'),
    body(['username']).notEmpty().withMessage('Username must be atleast one character long.')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
<<<<<<< Updated upstream
    const { password, username, email } = req.body
=======
    //const { password, username } = req.body
>>>>>>> Stashed changes

    // find existing username in database
    if ((await findUserByEmail(email)) || (await findUserByUsername(username))) {
      // throw bad request error if user exist
      throw new BadRequestError('Invalid Email or Username', ['Change Email or Username'])
    }

    // hash password
<<<<<<< Updated upstream
    const passwordHash = await Password.toHash(password)
=======
    //const passwordHash = await Password.toHash(password)
>>>>>>> Stashed changes

    // create and commit new user to db
    try {
      await User.create({ username, email, password: passwordHash })

<<<<<<< Updated upstream
      // return success response
      return res.status(201).send({
        message: 'Successful signed up!',
        links: [{ href: '/api/auth/signin', rel: 'self', method: 'POST' }]
      })
    } catch (e) {
      throw new InternalServerError('Something went wrong with saving the user in the database')
    }
=======
    // commit database transaction

    return res.status(201).send({
      message: 'Successful signed up!',
      links: [{ href: '/api/auth/signin', rel: 'self', method: 'POST' }]
    })
>>>>>>> Stashed changes
  }
)

export { router as signUpRouter }
