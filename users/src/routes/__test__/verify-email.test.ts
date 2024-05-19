import { Types } from "mongoose";
import request from "supertest";

import { app } from "../../app"; // Import your express app
import { API_BASE_URL } from "../../constants";
import { Token, TokenType } from "../../models/token";
import { Gender, User, UserRole } from "../../models/user";

it("should verify the user's email with a valid token", async () => {
  // Create a new user and token
  const user = User.build({
    email: "test@test.com",
    password: "password",
    dob: new Date(),
    gender: Gender.MALE,
    role: UserRole.PATIENT,
    fullName: "Test",
    phoneNumber: "555-555-5555",
  });
  await user.save();

  const token = Token.build({
    type: TokenType.EMAIL_VERIFICATION,
    userId: user.id,
  });
  await token.save();

  // Make a request to verify the email
  const response = await request(app)
    .post(`${API_BASE_URL}/verify-email/${token.value}`)
    .send()
    .expect(200);

  // Verify the response
  expect(response.body.emailVerified).toBeTruthy();

  // Verify the user in the database
  const updatedUser = await User.findById(user.id);
  expect(updatedUser?.emailVerified).toBeTruthy();

  // Verify the token has been deleted
  const deletedToken = await Token.findById(token.id);
  expect(deletedToken).toBeNull();
});

it("should return an error if the token is invalid or expired", async () => {
  const response = await request(app)
    .post(`${API_BASE_URL}/verify-email/invalid-token`)
    .send()
    .expect(400);

  expect(response.body.errors[0].message).toEqual("Invalid/Expired Token");
});

it("should return an error if the user does not exist", async () => {
  // Create a token without a user
  const token = Token.build({
    type: TokenType.EMAIL_VERIFICATION,
    userId: new Types.ObjectId().toHexString(),
  });
  await token.save();

  const response = await request(app)
    .post(`${API_BASE_URL}/verify-email/${token.value}`)
    .send()
    .expect(400);

  expect(response.body.errors[0].message).toEqual("Invalid/Expired Token");
});
