import { DatabaseError } from '../errors/database-error'
import User from '../model/User'

// Create a new User and insert into database
export async function createUser(name: string, email: string, password: string) {
  try {
    return User.create({
      name: name,
      email: email,
      password: password
    })
  } catch (err: any) {
    throw new DatabaseError(err)
  }
}

//Find data
//by email
export async function findUserByEmail(email: string) {
  return User.findOne({ email: email }, 'name played won')
}

export async function findUserByUsername(username: string) {
  return User.findOne({ username }, 'name played won')
}

export async function findEmailAndPass(email: string, password: string) {
  return User.findOne({ email: email, password: password })
}

//exists() returns null or ObjectId of first item that matches criteria
export async function userExists(email: string) {
  return User.exists({ email: email })
}

//Increase games played
export async function increasePlayed(email: string) {
  const user = await findUserByEmail(email)
  if (user && user.played) {
    user.played = user.played + 1
    await user.save()
    return user
  } else {
    throw new DatabaseError('Could not find email in database.')
  }
}

//Increase wins
export async function increaseWon(email: string) {
  const user = await findUserByEmail(email)
  if (user && user.won) {
    user.won = user.won + 1
    await user.save()
    return user
  } else {
    throw new DatabaseError('Could not find email in database.')
  }
}

//returns names, games played, games won from all users, sorted by wins
export async function getUsers() {
  return User.find({}, "name played won").sort([["won", "desc"]]);
}
