import mongoose from 'mongoose'
const { Schema, model } = mongoose

// Document interface
interface IRanking {
  wins: number
  losses: number
  user: mongoose.Schema.Types.ObjectId
}

// Schema
const userSchema = new Schema<IRanking>({
  wins: {
    type: Number,
    default: 0
  },
  losses: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

// Model
const Ranking = model<IRanking>('User', userSchema)
export default Ranking
