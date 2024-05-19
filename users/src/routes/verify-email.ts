import express, { Request, Response } from "express";

import { BadRequestError } from "../../../common/src";
import { Token, TokenType } from "../models/token";
import { User } from "../models/user";

// Create an Express router
const router = express.Router();

/**
 * Route handler for verifying a user's email address.
 * Validates the token, finds the associated user, marks the user's email as verified,
 * and sends a success response.
 */
router.post("/verify-email/:token", async (req: Request, res: Response) => {
  // Extract the token from the request parameters
  const token = req.params.token;

  // Find the token in the database
  const existingToken = await Token.findOne({
    value: token,
    type: TokenType.EMAIL_VERIFICATION,
  });

  // If the token is not found, throw an error
  if (!existingToken) {
    throw new BadRequestError("Invalid/Expired Token");
  }

  // Find the user associated with the token
  const user = await User.findById(existingToken.userId);

  // If the user is not found, throw an error
  if (!user) {
    throw new BadRequestError("Invalid/Expired Token");
  }

  // Set the user's emailVerified field to true
  user.emailVerified = new Date();

  // Save the user to the database
  await user.save();

  // Delete the token from the database
  await Token.findByIdAndDelete(existingToken.id);

  // Send a success response
  res.status(200).send(user);
});

// Export the router
export { router as verifyEmailRouter };
