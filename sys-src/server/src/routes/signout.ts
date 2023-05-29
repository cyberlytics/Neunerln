import express, { Request, Response } from 'express'

/**
 * Clears the request session.
 * * @route POST /api/auth/signout
 */
const router = express.Router()

router.post('/api/auth/signout', (req: Request, res: Response) => {
  req.session = null

  return res.status(200).send({ message: 'Successful signed out!' })
})

export { router as signoutRouter }
