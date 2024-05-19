import { Message } from "amqplib";

import { Listener, Subjects, UserCreatedEvent } from "../../../../common/src";
import { AMQP_EXCHANGE, AMQP_QUEUE } from "../../constants";
import { Mail } from "../../services/mail";

export class UserCreatedListener extends Listener<UserCreatedEvent> {
  exchange: string = AMQP_EXCHANGE;

  routingKey: Subjects.UserCreated = Subjects.UserCreated;

  queue: string = `${AMQP_QUEUE}:${this.routingKey}`;

  async onMessage(data: UserCreatedEvent["data"], msg: Message): Promise<void> {
    try {
      await Mail.sendWelcomeMessage(data.email);
      this.channel.ack(msg);
    } catch (error) {
      console.error(error);
      this.channel.nack(msg);
    }
  }
}
