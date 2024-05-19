import crypto from "crypto";
import mongoose from "mongoose";

export enum TokenType {
  EMAIL_VERIFICATION = "email-verification",
  RESET_PASSWORD = "reset-password",
}

// An interface that describes the properties required to create a Token.
export interface TokenAttrs {
  userId: string;
  type: TokenType;
}

// An interface that describes the properties a Token model has.
interface TokenModel extends mongoose.Model<TokenDoc> {
  build(attrs: TokenAttrs): TokenDoc;
}

// An interface that describes the properties a Token Document has.
export interface TokenDoc extends mongoose.Document {
  userId: string;
  value: string;
  type: TokenType;
  expiresAt: Date;
}

// Schema for the Token collection
const tokenSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
      // Generate a random 32-byte hex string as the default token value
      default: () => crypto.randomBytes(32).toString("hex"),
      unique: true,
    },
    type: {
      type: String,
      required: true,
      enum: Object.values(TokenType),
    },
    expiresAt: {
      type: Date,
      required: true,
      // Set the default expiration time to 15 minutes from now
      default: new Date(),
      expires: 15 * 60,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        // Rename the _id field to id
        ret.id = ret._id;

        // Remove the _id and __v fields from the JSON representation
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

/**
 * Builds a new token document
 * @param attrs - attributes for the token document
 */
tokenSchema.statics.build = (attrs: TokenAttrs) => {
  return new Token(attrs);
};

// Model for the user collection
const Token = mongoose.model<TokenDoc, TokenModel>("Token", tokenSchema);

export { Token };
