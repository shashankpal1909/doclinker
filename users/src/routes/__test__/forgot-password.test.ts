import request from "supertest";
import { app } from "../../app";
import { Gender, User, UserRole } from "../../models/user";
import { Token, TokenType } from "../../models/token";
import { TokenCreatedPublisher } from "../../events/publishers/token-created-publisher";
import { API_BASE_URL } from "../../constants";

it("returns a 200 on successful request", async () => {
  const user = User.build({
    email: "test@test.com",
    password: "password",
    dob: new Date("2000-01-01"),
    gender: Gender.MALE,
    role: UserRole.PATIENT,
    fullName: "Test User",
    phoneNumber: null,
  });

  await user.save();

  await request(app)
    .post(`${API_BASE_URL}/forgot-password`)
    .send({ email: user.email })
    .expect(200);

  const token = await Token.findOne({
    userId: user.id,
    type: TokenType.RESET_PASSWORD,
  });

  expect(token).not.toBeNull();
});

it("returns a 400 for invalid email format", async () => {
  const email = "invalid-email";

  const response = await request(app)
    .post(`${API_BASE_URL}/forgot-password`)
    .send({ email })
    .expect(400);

  expect(response.status).toBe(400);
});

it("returns a 400 when email is not provided", async () => {
  const response = await request(app)
    .post(`${API_BASE_URL}/forgot-password`)
    .send({})
    .expect(400);

  expect(response.status).toBe(400);
});

it("returns a 404 when the user is not found", async () => {
  const email = "notfound@example.com";

  await request(app)
    .post(`${API_BASE_URL}/forgot-password`)
    .send({ email })
    .expect(404);
});

it("publishes an event on successful token creation", async () => {
  const publishMock = jest.spyOn(TokenCreatedPublisher.prototype, "publish");

  const user = User.build({
    email: "test@test.com",
    password: "password",
    dob: new Date("2000-01-01"),
    gender: Gender.MALE,
    role: UserRole.PATIENT,
    fullName: "Test User",
    phoneNumber: null,
  });

  await user.save();

  await request(app)
    .post(`${API_BASE_URL}/forgot-password`)
    .send({ email: user.email })
    .expect(200);

  expect(publishMock).toHaveBeenCalled();
});
