import { amqpWrapper } from "./amqp-wrapper";
import { TokenCreatedListener } from "./events/listeners/token-created-listener";
import { UserCreatedListener } from "./events/listeners/user-created-listener";

/**
 * Starts the application.
 *
 * @remarks
 * This function initializes the database connection, initializes the AMQP
 * connection, and listens for events (if required).
 *
 * @throws Error if the AMQP_URL environment variables are not defined.
 *
 */
const start = async () => {
  if (!process.env.AMQP_URL) {
    throw new Error("AMQP_URL must be defined");
  }

  try {
    await amqpWrapper.connect(process.env.AMQP_URL);

    new UserCreatedListener(
      amqpWrapper.connection,
      amqpWrapper.channel
    ).listen();

    new TokenCreatedListener(
      amqpWrapper.connection,
      amqpWrapper.channel
    ).listen();
  } catch (error) {
    console.error(error);
  }
};

start();
