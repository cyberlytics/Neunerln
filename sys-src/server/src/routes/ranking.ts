import express, { Request, Response } from 'express'
import { body, param } from 'express-validator'
import { BadRequestError } from '../errors/bad-request-error'
import { validateRequest } from '../middlewares/validate-request'

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

    // throw 404 error if user doesnt exist

    // create database transaction to save ranking

    // commit database transaction

    return res.status(201).send({
      message: 'Successfully created Ranking!',
      links: [{ href: '/api/rankings/{userId}', rel: 'self', method: 'POST' }]
    })
  }
)
