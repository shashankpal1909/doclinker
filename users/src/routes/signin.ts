import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { BadRequestError, validateRequest } from "../../../common/src";
import { amqpWrapper } from "../amqp-wrapper";
import { TokenCreatedPublisher } from "../events/publishers/token-created-publisher";
import { Token, TokenType } from "../models/token";
import { User } from "../models/user";
import { Password } from "../services/password";

// Create an Express router
const router = express.Router();

/**
 * Route handler for user sign-in.
 * Validates user input, checks credentials, generates a JWT, and sets it in the session.
 */
router.post(
  "/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("You must enter a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid Login Credentials");
    }

    // Compare passwords
    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordsMatch) {
      throw new BadRequestError("Invalid Login Credentials");
    }

    // Check for email verification
    if (!existingUser.emailVerified) {
      // Create an email verification token
      const token = Token.build({
        userId: existingUser.id,
        type: TokenType.EMAIL_VERIFICATION,
      });
      await token.save();

      // Publish a token-created event
      new TokenCreatedPublisher(
        amqpWrapper.connection,
        amqpWrapper.channel
      ).publish({
        email: existingUser.email,
        type: token.type,
        token: token.value,
      });

      throw new BadRequestError("Email not verified");
    }

    // Generate a JWT (JSON Web Token)
    const userJWT = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      process.env.JWT_KEY!
    );

    // Store the JWT on the session object
    req.session = { jwt: userJWT };

    // Send a successful response
    res.status(200).send(existingUser);
  }
);

// Export the router
export { router as signInRouter };
