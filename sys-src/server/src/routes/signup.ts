import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError } from '../errors/bad-request-error';
import { validateRequest } from '../middlewares/validate-request';
import {
  BCRYPT_MAX_LENGTH,
  BCRYPT_MIN_LENGTH,
  passwordRegex,
} from '../config/auth.config';
import { Password } from '../services/password';

const router = express.Router();

router.post(
  '/api/auth/signup',
  [
    body('password')
      .trim()
      .isLength({ min: BCRYPT_MIN_LENGTH, max: BCRYPT_MAX_LENGTH })
      .matches(passwordRegex)
      .withMessage('Password must be between 8 and 64 characters long.'),
    body(['username'])
      .notEmpty()
      .withMessage('Username must be atleast one character long.'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { password, username } = req.body;

    // find existing username in database

    // throw bad request error if user exist

    // hash password
    const passwordHash = await Password.toHash(password);

    // create database transaction to save user

    // commit database transaction

    return res.status(201).send({
      message: 'Successful signed up!',
      links: [{ href: '/api/auth/signin', rel: 'self', method: 'POST' }],
    });
  }
);
