import request from "supertest";

import { app } from "../../app";
import { API_BASE_URL } from "../../constants";
import { UserCreatedPublisher } from "../../events/publishers/user-created-publisher";
import { Token } from "../../models/token";
import { Gender, User, UserRole } from "../../models/user";
import { Mail } from "../../services/mail";

it("returns a 201 on successful signup", async () => {
  const response = await request(app)
    .post(`${API_BASE_URL}/signup`)
    .send({
      email: "test@test.com",
      password: "password",
      role: "patient",
      gender: "male",
      dob: "2000-01-01",
      fullName: "Test User",
    })
    .expect(201);

  // Validate response
  expect(response.body.email).toEqual("test@test.com");
  expect(response.body.role).toEqual("patient");
});

it("returns 400 if email is already in use", async () => {
  await request(app)
    .post(`${API_BASE_URL}/signup`)
    .send({
      email: "test@test.com",
      password: "password",
      role: "patient",
      dob: "2002-09-19",
      gender: "male",
      fullName: "Test User",
      phoneNumber: "1234567890",
    })
    .expect(201);

  await request(app)
    .post(`${API_BASE_URL}/signup`)
    .send({
      email: "test@test.com",
      password: "password",
      role: "patient",
      dob: "2000-01-01",
      gender: "male",
      fullName: "Test User",
      phoneNumber: "1234567890",
    })
    .expect(400);
});

it("returns a 400 with an invalid email", async () => {
  await request(app)
    .post(`${API_BASE_URL}/signup`)
    .send({
      email: "invalid-email",
      password: "password",
      role: "patient",
      gender: "male",
      dob: "2000-01-01",
      fullName: "Test User",
    })
    .expect(400);
});

it("returns a 400 with an invalid password", async () => {
  await request(app)
    .post(`${API_BASE_URL}/signup`)
    .send({
      email: "test@test.com",
      password: "123",
      role: "patient",
      gender: "male",
      dob: "2000-01-01",
      fullName: "Test User",
    })
    .expect(400);
});

it("returns a 400 with a missing required field", async () => {
  await request(app)
    .post(`${API_BASE_URL}/signup`)
    .send({
      email: "test@test.com",
      password: "password",
      role: "patient",
      dob: "2000-01-01",
      fullName: "Test User",
    })
    .expect(400);
});

it("returns a 400 when email is already in use", async () => {
  const existingUser = User.build({
    email: "test@test.com",
    password: "password",
    role: UserRole.PATIENT,
    fullName: "Existing User",
    dob: new Date("2000-01-01"),
    gender: Gender.MALE,
    phoneNumber: null,
  });
  await existingUser.save();

  await request(app)
    .post(`${API_BASE_URL}/signup`)
    .send({
      email: "test@test.com",
      password: "password",
      role: "patient",
      gender: "male",
      dob: "2000-01-01",
      fullName: "Test User",
    })
    .expect(400);
});

it("creates a token and sends an email verification link on successful signup", async () => {
  const sendEmailVerificationLinkMock = jest.spyOn(
    Mail,
    "sendEmailVerificationLink"
  );

  await request(app)
    .post(`${API_BASE_URL}/signup`)
    .send({
      email: "test@test.com",
      password: "password",
      role: "patient",
      gender: "male",
      dob: "2000-01-01",
      fullName: "Test User",
    })
    .expect(201);

  const user = await User.findOne({ email: "test@test.com" });
  const token = await Token.findOne({ userId: user!.id });

  expect(token).not.toBeNull();
  expect(sendEmailVerificationLinkMock).toHaveBeenCalled();
});

it("publishes an event on successful signup", async () => {
  const publishMock = jest.spyOn(UserCreatedPublisher.prototype, "publish");

  await request(app)
    .post(`${API_BASE_URL}/signup`)
    .send({
      email: "test@test.com",
      password: "password",
      role: "patient",
      gender: "male",
      dob: "2000-01-01",
      fullName: "Test User",
    })
    .expect(201);

  expect(publishMock).toHaveBeenCalled();
});
