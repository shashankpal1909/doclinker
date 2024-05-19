import { Subjects } from "./subjects";

/**
 * An interface for a token created event.
 * @interface
 */
export interface TokenCreatedEvent {
  // The name of the exchange to publish the event to.
  exchange: string;

  // The routing key to use when publishing the event.
  routingKey: Subjects.TokenCreated;

  // The data to publish with the event.
  data: {
    email: string;
    type: "email-verification" | "reset-password";
    token: string;
  };
}
