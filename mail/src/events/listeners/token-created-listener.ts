import { Message } from "amqplib";

import { Listener, Subjects, TokenCreatedEvent } from "../../../../common/src";
import { AMQP_EXCHANGE, AMQP_QUEUE } from "../../constants";
import { Mail } from "../../services/mail";

export class TokenCreatedListener extends Listener<TokenCreatedEvent> {
  exchange: string = AMQP_EXCHANGE;

  routingKey: Subjects.TokenCreated = Subjects.TokenCreated;

  queue: string = `${AMQP_QUEUE}:${this.routingKey}`;

  async onMessage(
    data: TokenCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    try {
      switch (data.type) {
        case "email-verification":
          await Mail.sendEmailVerificationLink(data.email, data.token);
          break;
        case "reset-password":
          await Mail.sendPasswordResetLink(data.email, data.token);
          break;
        default:
          break;
      }

      this.channel.ack(msg);
    } catch (error) {
      console.error(error);
      this.channel.nack(msg);
    }
  }
}
