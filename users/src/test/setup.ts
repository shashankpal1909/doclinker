import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

import { Gender, User, UserDoc, UserRole } from "../models/user";

jest.mock("../amqp-wrapper");

declare global {
  var signIn: (user?: {
    email: string;
    password: string;
    dob: string;
    gender: Gender;
    role: UserRole;
    fullName: string;
    phoneNumber: string | null;
  }) => Promise<{ user: UserDoc; cookie: string[] }>;
}

// Set up the MongoDB memory server and connect to it before running the tests
let mongo: MongoMemoryServer;
beforeAll(async () => {
  process.env.JWT_KEY = "asdfasdf";

  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  await mongoose.connect(uri);
});

// Clear the database after each test
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// Disconnect from the MongoDB memory server after all tests are done
afterAll(async () => {
  await mongoose.connection.dropDatabase();
//  await mongoose.connection.close();
//  await mongo.stop();
});

global.signIn = async (
  user: {
    email: string;
    password: string;
    dob: string;
    gender: Gender;
    role: UserRole;
    fullName: string;
    phoneNumber: string | null;
  } = {
    email: "test@test.com",
    password: "password",
    dob: "2000-01-01",
    gender: Gender.MALE,
    role: UserRole.PATIENT,
    fullName: "Test",
    phoneNumber: "555-555-5555",
  }
) => {
  const dbUser = User.build({ ...user, dob: new Date(user.dob) });
  await dbUser.save();

  const payload = {
    id: dbUser.id,
    email: dbUser.email,
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object. { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // return a string thats the cookie with the encoded data
  return { user: dbUser, cookie: [`session=${base64}`] };
};
