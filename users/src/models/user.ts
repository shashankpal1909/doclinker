import mongoose from "mongoose";

import { Password } from "../services/password";

export enum UserRole {
  ADMIN = "admin",
  PATIENT = "patient",
  DOCTOR = "doctor",
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

// An interface that describes the properties required to create a User.
export interface UserAttrs {
  email: string;
  password: string;
  dob: Date;
  gender: Gender;
  role: UserRole;
  fullName: string;
  phoneNumber: string | null;
}

// An interface that describes the properties a User model has.
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties a User Document has.
export interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  role: UserRole;
  dob: Date;
  gender: Gender;
  fullName: string;
  phoneNumber: string | null;
  emailVerified: Date | null;
}

// Schema for the user collection
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      default: null,
    },
    emailVerified: {
      type: Date,
      default: null,
    },
    role: {
      type: String,
      default: UserRole.PATIENT,
      required: true,
      enum: Object.values(UserRole),
    },
    dob: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: Object.values(Gender),
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;

        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

// Middleware: Hash the password before saving
userSchema.pre("save", async function (done) {
  // Check if the password has been modified
  if (this.isModified("password")) {
    // Hash the password using the Password service
    const hashed = await Password.toHash(this.get("password"));

    // Set the hashed password on the user document
    this.set("password", hashed);
  }

  // Call the done callback to continue the save operation
  done();
});

/**
 * Builds a new user document
 * @param attrs - attributes for the user document
 */
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// Model for the user collection
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
