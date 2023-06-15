import { DatabaseError } from '../errors/database-error'
import User from '../model/User'

// Create a new User and insert into database
export async function createUser(username: string, email: string, password: string) {
  try {
    return User.create({
      username,
      email,
      password
    })
  } catch (err: any) {
    throw new DatabaseError(err)
  }
}

//Find data
//by email
export async function findUserByEmail(email: string) {
  return await User.findOne({ email }, 'username played won')
}

export async function findUserByUsername(username: string) {
  return await User.findOne({ username }, 'username played won')
}

export async function findEmailAndPass(email: string, password: string) {
  return await User.findOne({ email: email, password: password })
}

//exists() returns null or ObjectId of first item that matches criteria
export async function userExists(email: string) {
  return User.exists({ email: email })
}

//Increase games played
export async function increasePlayed(email: string) {
  const user = await findUserByEmail(email)
  if (user && typeof user.played === 'number') {
    user.played = user.played + 1
    await user.save()
    return user
  } else {
    throw new DatabaseError('something went wrong with user.played')
  }
}

//Increase wins
export async function increaseWon(email: string) {
  const user = await findUserByEmail(email)
  if (user && typeof user.won === 'number') {
    user.won = user.won + 1
    await user.save()
    return user
  } else {
    throw new DatabaseError('something went wrong with user.won.')
  }
}

//returns names, games played, games won from all users, sorted by wins
export async function getUsers() {
  return User.find({}, 'username played won').sort([['won', 'desc']])
}
