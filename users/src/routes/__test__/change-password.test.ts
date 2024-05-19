import mongoose from "mongoose";
// change-password.test.ts
import request from "supertest";

import { app } from "../../app";
import { API_BASE_URL } from "../../constants";
import { User } from "../../models/user";
import { Password } from "../../services/password";

describe("Change password route tests", () => {
  it("returns a 200 on successful password change", async () => {
    const oldPassword = "password";
    const newPassword = "newpassword";

    const { user, cookie } = await global.signIn();

    await request(app)
      .post(`${API_BASE_URL}/change-password`)
      .set("Cookie", cookie!)
      .send({
        oldPassword,
        newPassword,
      })
      .expect(200);

    const updatedUser = await User.findById(user.id);
    expect(await Password.compare(updatedUser!.password, newPassword)).toBe(
      true
    );
  }, 10000);

  it("returns a 400 with a missing old password", async () => {
    const newPassword = "newpassword";
    await request(app)
      .post(`${API_BASE_URL}/change-password`)
      .send({
        newPassword,
      })
      .expect(400);
  }, 10000);

  it("returns a 400 with an invalid new password", async () => {
    const oldPassword = "oldpassword";
    const newPassword = "123";
    await request(app)
      .post(`${API_BASE_URL}/change-password`)
      .send({
        oldPassword,
        newPassword,
      })
      .expect(400);
  }, 10000);

  it("returns a 404 if the user is not found", async () => {
    const oldPassword = "password";
    const newPassword = "newpassword";

    const { user, cookie } = await global.signIn();

    await request(app)
      .post(`${API_BASE_URL}/change-password`)
      .set("Cookie", cookie!)
      .send({
        oldPassword,
        newPassword,
      })
      .expect(404);
  }, 10000);

  it("returns a 400 with invalid login credentials", async () => {
    const wrongOldPassword = "wrongoldpassword";
    const newPassword = "newpassword";

    const { cookie } = await global.signIn();

    await request(app)
      .post(`${API_BASE_URL}/change-password`)
      .set("Cookie", cookie!)
      .send({
        oldPassword: wrongOldPassword,
        newPassword,
      })
      .expect(400);
  }, 10000);
});
