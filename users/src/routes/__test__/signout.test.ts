import request from "supertest";
import { app } from "../../app";
import { API_BASE_URL } from "../../constants";

it("clears the cookie after signing out", async () => {
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

  const response = await request(app)
    .post(`${API_BASE_URL}/signout`)
    .send({})
    .expect(200);

  expect(response.get("Set-Cookie")).toEqual([
    "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly",
  ]);
});
