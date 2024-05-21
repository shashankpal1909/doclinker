import request from "supertest";
import { app } from "../../app";
import { Gender, User, UserRole } from "../../models/user";
import { Token, TokenType } from "../../models/token";
import { TokenCreatedPublisher } from "../../events/publishers/token-created-publisher";
import { API_BASE_URL } from "../../constants";
import { Password } from "../../services/password";

it("returns a 200 on successful password reset", async () => {
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

  const newPassword = "newpassword";

  await request(app)
    .post(`${API_BASE_URL}/reset-password/${token!.value}`)
    .send({
      password: newPassword,
    })
    .expect(200);

  const updatedUser = await User.findById(user.id);

  expect(await Password.compare(updatedUser!.password, newPassword)).toBe(true);
  expect(await Token.findById(token!.id)).toBeNull();
});

it("returns a 400 if token is invalid/expired", async () => {
  await request(app)
    .post(`${API_BASE_URL}/reset-password/invalid-token`)
    .send({
      password: "password",
    })
    .expect(400);
});

it("returns a 400 if provided password is invalid", async () => {
  await request(app)
    .post(`${API_BASE_URL}/reset-password/test-token`)
    .send({
      password: "123",
    })
    .expect(400);
});
