import request from "supertest";

import { app } from "../../app";
import { API_BASE_URL } from "../../constants";
import { Token } from "../../models/token";
import { Gender, User, UserRole } from "../../models/user";
import { Mail } from "../../services/mail";

it("returns a 200 on successful signin", async () => {
  const password = "password";
  const user = User.build({
    email: "test@test.com",
    password,
    dob: new Date("2000-01-01"),
    gender: Gender.MALE,
    role: UserRole.PATIENT,
    fullName: "Test",
    phoneNumber: null,
  });

  user.emailVerified = new Date();
  await user.save();

  const response = await request(app)
    .post(`${API_BASE_URL}/signin`)
    .send({
      email: "test@test.com",
      password,
    })
    .expect(200);

  // Validate response
  expect(response.body.email).toEqual("test@test.com");
});

it("returns a 400 with an invalid email", async () => {
  await request(app)
    .post(`${API_BASE_URL}/signin`)
    .send({
      email: "invalid-email",
      password: "password",
    })
    .expect(400);
});

it("returns a 400 with a missing password", async () => {
  await request(app)
    .post(`${API_BASE_URL}/signin`)
    .send({
      email: "test@test.com",
    })
    .expect(400);
});

it("returns a 400 with invalid login credentials", async () => {
  const password = "password";
  const user = User.build({
    email: "test@test.com",
    password,
    dob: new Date("2000-01-01"),
    gender: Gender.MALE,
    role: UserRole.PATIENT,
    fullName: "Test",
    phoneNumber: null,
  });

  user.emailVerified = new Date();
  await user.save();

  await request(app)
    .post(`${API_BASE_URL}/signin`)
    .send({
      email: "test@test.com",
      password: "wrongpassword",
    })
    .expect(400);
});

it("returns a 400 when email is not verified", async () => {
  const password = "password";
  const user = User.build({
    email: "test@test.com",
    password,
    dob: new Date("2000-01-01"),
    gender: Gender.MALE,
    role: UserRole.PATIENT,
    fullName: "Test",
    phoneNumber: null,
  });

  await user.save();

  const sendEmailVerificationLinkMock = jest.spyOn(
    Mail,
    "sendEmailVerificationLink"
  );

  await request(app)
    .post(`${API_BASE_URL}/signin`)
    .send({
      email: "test@test.com",
      password,
    })
    .expect(400);

  const token = await Token.findOne({ userId: user.id });

  expect(token).not.toBeNull();
  expect(sendEmailVerificationLinkMock).toHaveBeenCalled();
});

it("sets a cookie after successful signin", async () => {
  const password = "password";
  const user = User.build({
    email: "test@test.com",
    password,
    dob: new Date("2000-01-01"),
    gender: Gender.MALE,
    role: UserRole.PATIENT,
    fullName: "Test",
    phoneNumber: null,
  });

  user.emailVerified = new Date();
  await user.save();

  const response = await request(app)
    .post(`${API_BASE_URL}/signin`)
    .send({
      email: "test@test.com",
      password,
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
