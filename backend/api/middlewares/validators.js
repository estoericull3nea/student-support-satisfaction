// middlewares/validators.js
import { body } from 'express-validator'

export const validateUserRegistration = [
  body('firstName').not().isEmpty().withMessage('First name is required'),
  body('lastName').not().isEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
]
