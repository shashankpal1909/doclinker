import express, { Request, Response } from "express";
import { body } from "express-validator";

import { NotFoundError } from "../../../common/src";

import { User } from "../models/user";
import { Token, TokenType } from "../models/token";
import { Mail } from "../services/mail";

// Create an Express router
const router = express.Router();

/**
 * Route handler for forgotten password requests.
 * Validates the email input, finds the user, generates a reset token,
 * sends the reset link to the user's email, and returns a success response.
 */
router.post(
  "/forgot-password",
  [body("email").trim().isEmail().withMessage("Invalid Email")],
  async (req: Request, res: Response) => {
    // Extract the email from the request body
    const { email } = req.body;

    // Find the user with the given email
    const user = await User.findOne({ email });

    // If the user is not found, throw a NotFoundError
    if (!user) {
      throw new NotFoundError();
    }

    // Create a new reset token for the user
    const token = Token.build({
      userId: user.id,
      type: TokenType.RESET_PASSWORD,
    });

    // Save the token to the database
    await token.save();

    // Send the password reset link to the user's email
    Mail.sendPasswordResetLink(user.email, token.value);

    // Return a success response
    res.status(200);
  }
);

// Export the router
export { router as forgotPasswordRouter };
