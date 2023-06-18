import express, { Request, Response } from 'express'
import { InternalServerError } from '../errors/interal-server-error'
import { getUsers } from '../database/User'

const router = express.Router()

router.get('/api/rankings', async (req: Request, res: Response) => {
  // create and commit new user to db
  try {
    const all = await getUsers()
    const responseData = all.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      played: user.played,
      wins: user.won,
      winrate: calcWR(user.won, user.played)
    }))
    // return success response
    return res.status(201).send({
      message: 'Successfully retrieved all Rankings!',
      ranking: responseData
    })
  } catch (e) {
    throw new InternalServerError('Something went wrong')
  }
})

function calcWR(wins: any, games: any) {
  if (games === 0) {
    return 0
  }
  return (wins / games) * 100
}

export { router as rankingRouter }
