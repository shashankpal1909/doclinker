import express, { Request, Response } from "express";
import { body } from "express-validator";

import { BadRequestError } from "../../../common/src";
import { Token, TokenType } from "../models/token";
import { User } from "../models/user";

const router = express.Router();

/**
 * Route handler for resetting a user's password.
 * Validates the password input, finds the user associated with the token,
 * updates the user's password, and sends a success response.
 */
router.post(
  "/reset-password/:token",
  [
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  async (req: Request, res: Response) => {
    const token = req.params.token;
    const { password } = req.body;

    // Find the token in the database
    const existingToken = await Token.findOne({
      value: token,
      type: TokenType.RESET_PASSWORD,
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

    // Update the user's password
    user.password = password;

    // Save the user to the database
    await user.save();

    // Delete the token from the database
    await Token.findByIdAndDelete(existingToken.id);

    // Send a success response
    res.status(200).send();
  }
);

// Export the router
export { router as resetPasswordRouter };
