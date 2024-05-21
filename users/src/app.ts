import "express-async-errors";

import { json } from "body-parser";
import cookieSession from "cookie-session";
import express from "express";
import morgan from "morgan";

import { currentUser, errorHandler, NotFoundError } from "../../common/src";
import { API_BASE_URL } from "./constants";
import { changePasswordRouter } from "./routes/change-password";
import { currentUserRouter } from "./routes/current-user";
import { forgotPasswordRouter } from "./routes/forgot-password";
import { resetPasswordRouter } from "./routes/reset-password";
import { signInRouter } from "./routes/signin";
import { signOutRouter } from "./routes/signout";
import { signUpRouter } from "./routes/signup";
import { verifyEmailRouter } from "./routes/verify-email";
import { logger } from "./logger";

// Initialize the express app
const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV === "production",
  })
);

// Health check route
app.get(`${API_BASE_URL}/health`, (_req, res) => {
  res.status(200).send({ message: "Hello World" });
});

app.use(currentUser);

// Mount routes
app.use(API_BASE_URL, changePasswordRouter);
app.use(API_BASE_URL, currentUserRouter);
app.use(API_BASE_URL, forgotPasswordRouter);
app.use(API_BASE_URL, resetPasswordRouter);
app.use(API_BASE_URL, signInRouter);
app.use(API_BASE_URL, signOutRouter);
app.use(API_BASE_URL, signUpRouter);
app.use(API_BASE_URL, verifyEmailRouter);

// Define 404 Not Found handler
app.all("*", async (_req, _res) => {
  throw new NotFoundError();
});

// Error handling middleware
app.use(errorHandler);

// Export the app
export { app };
