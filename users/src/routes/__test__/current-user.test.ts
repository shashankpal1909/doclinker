import request from "supertest";
import { app } from "../../app";
import { API_BASE_URL } from "../../constants";

it("responds with details about the current user", async () => {
  const {user, cookie} = await global.signIn();

  const response = await request(app)
    .get(`${API_BASE_URL}/currentuser`)
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual(user.email);
});

it("responds with null if not authenticated", async () => {
  const response = await request(app)
    .get(`${API_BASE_URL}/currentuser`)
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});
