import express, { Request, Response } from "express";
import { body } from "express-validator";

import {
  BadRequestError,
  NotFoundError,
  requireAuth,
} from "../../../common/src";
import { User } from "../models/user";
import { Password } from "../services/password";

// Create an Express router
const router = express.Router();

/**
 * Route handler for changing a user's password.
 * Validates the old and new passwords, checks if the user exists,
 * compares the old password, updates the user's password, and returns a success response.
 */
router.post(
  "/change-password",
  requireAuth,
  [
    body("oldPassword")
      .trim()
      .notEmpty()
      .withMessage("Old password is required"),
    body("newPassword")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("New password must be between 4 and 20 characters"),
  ],
  async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;

    // Find the user by ID
    const user = await User.findById(req.currentUser!.id);

    // If the user is not found, throw a NotFoundError
    if (!user) {
      throw new NotFoundError();
    }

    // Compare the old password
    const passwordsMatch = await Password.compare(user.password, oldPassword);
    if (!passwordsMatch) {
      throw new BadRequestError("Invalid Login Credentials");
    }

    // Update the user's password
    user.password = newPassword;
    await user.save();

    // Return a success response
    res.status(200).send();
  }
);

// Export the router
export { router as changePasswordRouter };
