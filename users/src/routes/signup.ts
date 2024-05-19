import express, { Request, Response } from "express";
import { body } from "express-validator";

import { BadRequestError, validateRequest } from "../../../common/src";
import { amqpWrapper } from "../amqp-wrapper";
import { TokenCreatedPublisher } from "../events/publishers/token-created-publisher";
import { UserCreatedPublisher } from "../events/publishers/user-created-publisher";
import { Token, TokenType } from "../models/token";
import { Gender, User, UserRole } from "../models/user";
import { Mail } from "../services/mail";

// Create an Express router
const router = express.Router();

/**
 * Route handler for user sign-up.
 * Validates user input, checks for existing users, creates a new user,
 * sends an email verification link, and publishes a user-created event.
 */
router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
    body("role")
      .trim()
      .isIn(Object.values(UserRole))
      .withMessage("Invalid Role"),
    body("gender")
      .trim()
      .isIn(Object.values(Gender))
      .withMessage("Invalid Gender"),
    body("dob")
      .isDate({ format: "yyyy-MM-dd" })
      .withMessage("DOB must be a valid date in YYYY-MM-DD format"),
    body("fullName").trim().not().isEmpty().withMessage("Invalid Name"),
    body("phoneNumber")
      .optional()
      .trim()
      .isMobilePhone("any")
      .withMessage("Invalid Phone Number"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password, role, dob, gender, fullName, phoneNumber } =
      req.body;

    // Check if email is already in use
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("Email already in use");
    }

    // Create a new user
    const user = User.build({
      email,
      password,
      role,
      fullName,
      phoneNumber,
      dob: new Date(dob),
      gender,
    });
    await user.save();

    // Create an email verification token
    const token = Token.build({
      userId: user.id,
      type: TokenType.EMAIL_VERIFICATION,
    });
    await token.save();

    // Publish a user-created event
    new UserCreatedPublisher(
      amqpWrapper.connection,
      amqpWrapper.channel
    ).publish({
      id: user.id,
      email: user.email,
      role: user.role,
      dob: user.dob,
      gender: user.gender,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      emailVerified: user.emailVerified,
    });

    // Publish a token-created event
    new TokenCreatedPublisher(
      amqpWrapper.connection,
      amqpWrapper.channel
    ).publish({
      email: user.email,
      type: token.type,
      token: token.value,
    });

    // Send a successful response
    res.status(201).send(user);
  }
);

// Export the router
export { router as signUpRouter };
