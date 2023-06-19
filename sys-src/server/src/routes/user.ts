import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { InternalServerError } from '../errors/interal-server-error'
import { BadRequestError } from '../errors/bad-request-error'
import { validateRequest } from 'src/middlewares/validate-request'
import { increasePlayed, increaseWon, findUserByEmail } from 'src/database/User'

const router = express.Router()

router.put(
  '/api/users/:userMail/stats',
  body('didWin').notEmpty(),
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { userMail } = req.params
      const didWin = req.body
      // return success response
      if (findUserByEmail(userMail) === null) {
        throw new BadRequestError('User does not exist', ['Check User E-Mail'])
      }
      increasePlayed(userMail)
      if (didWin === true) {
        increaseWon(userMail)
      }
      return res.status(201).send({
        message: 'Successfully updated User Stats!',
        user: findUserByEmail(userMail)
      })
    } catch (e) {
      throw new InternalServerError('Something went wrong with updating the users stats')
    }
  }
)
