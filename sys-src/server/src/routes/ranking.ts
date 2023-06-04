import express, { Request, Response } from 'express'
import { body, param } from 'express-validator'
import { BadRequestError } from '../errors/bad-request-error'
import { validateRequest } from '../middlewares/validate-request'
import { InternalServerError } from '../errors/interal-server-error'
import Ranking from 'src/model/Ranking'

const router = express.Router()

router.post(
  '/api/rankings/{userId}',
  [
    param('userId')
      .notEmpty()
      .withMessage('User ID must be provided.')
      .isInt()
      .withMessage('User ID must be an integer.'),
    body('wins')
      .trim()
      .isInt({ min: 0 })
      .withMessage('Wins must be an Integer with a value of 0 or greater'),
    body('losses')
      .trim()
      .isInt({ min: 0 })
      .withMessage('Losses must be an Integer with a value of 0 or greater')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { userId } = req.params
    const { wins, losses } = req.body

    if (await findUserById(userId)) {
      // throw bad request error if user doesnt exist
      throw new BadRequestError('User does not exist', ['User does not exist'])
    }
    // create and commit new user to db
    try {
      await Ranking.create({ wins, losses, userId })

      // return success response
      return res.status(201).send({
        message: 'Successfully created Ranking!',
        links: [{ href: '/api/rankings/{userId}', rel: 'self', method: 'POST' }]
      })
    } catch (e) {
      throw new InternalServerError('Something went wrong with saving the user in the database')
    }
  }
)
