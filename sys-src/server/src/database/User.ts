import { DatabaseError } from '../errors/database-error'
import User from '../model/User'

// Create a new User and insert into database
export async function createUser(name: string, email: string, password: string) {
  try {
    return User.create({
      name,
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
  const user = await User.findOne({ email }, 'name played won')
  if(user)
  {
    return user;
  } else {
    throw new DatabaseError('Could not find email in database.')
  }
}

export async function findUserByUsername(name: string) {
  const user = await User.findOne({ name }, 'name played won')
  if(user) {
    return user;
  } else {
    throw new DatabaseError('Could not find username in database.')
  }
}

export async function findEmailAndPass(email: string, password: string) {
  const user = await User.findOne({ email: email, password: password })
  if(user) {
    return user;
  } else {
    throw new DatabaseError('Could not find user in database.')
  }
}

//exists() returns null or ObjectId of first item that matches criteria
export async function userExists(email: string) {
  return User.exists({ email: email })
}

//Increase games played
export async function increasePlayed(email: string) {
  const user = await findUserByEmail(email)
  if (typeof user.played==="number") {
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
  if (typeof user.won==="number") {
    user.won = user.won + 1
    await user.save()
    return user
  } else {
    throw new DatabaseError('something went wrong with user.won.')
  }
}

//returns names, games played, games won from all users, sorted by wins
export async function getUsers() {
  return User.find({}, "name played won").sort([["won", "desc"]]);
}
