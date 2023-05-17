import express, { Request, Response } from 'express'

/**
 * a route for demonstration purposes
 */

const router = express.Router()

router.get(
  '/api/test',

  async (req: Request, res: Response) => {
    return res.status(200).send({
      user: ['1', '2', '3']
    })
  }
)

export default router
