import { Channel, Connection } from "amqplib";

export const amqpWrapper = {
  _connection: undefined as Connection | undefined,
  _channel: {
    assertExchange: jest.fn(
      async (exchange: string, type: string, _options: any) => {
        console.log(`Mock assertExchange called with: ${exchange}, ${type}`);
      }
    ),
    publish: jest.fn(
      (
        exchange: string,
        routingKey: string,
        content: Buffer,
        _options?: any
      ): boolean => {
        console.log(
          `Mock publish called with: ${exchange}, ${routingKey}, ${content.toString()}`
        );
        return true;
      }
    ),
  },

  connect: jest.fn(async (_url: string): Promise<boolean> => {
    return true;
  }),

  get connection() {
    return this._connection;
  },

  get channel() {
    return this._channel;
  },
};
