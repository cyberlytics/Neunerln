import mongoose from "mongoose";
const { Schema, model } = mongoose;

// Document interface
interface IUser{
  name: string;
  email: string;
  password: string;
  played?: number;
  won?: number;
}

// Schema
const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  played: {
    type: Number,
    default: 0,
  },
  won: {
    type: Number,
    default: 0,
  }
});

// Model
const User = model<IUser>("User", userSchema);
export default User;
