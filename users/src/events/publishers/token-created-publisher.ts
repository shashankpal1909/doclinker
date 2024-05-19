import { Publisher, Subjects, TokenCreatedEvent } from "../../../../common/src";
import { AMQP_EXCHANGE } from "../../constants";

// Publisher for the token created event.
export class TokenCreatedPublisher extends Publisher<TokenCreatedEvent> {
  // Exchange name.
  exchange: string = AMQP_EXCHANGE;

  // Routing key.
  routingKey: Subjects.TokenCreated = Subjects.TokenCreated;
}
