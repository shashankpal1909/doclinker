/**
 * @enum Subjects
 * @description A list of subjects that can be broadcasted
 */
export enum Subjects {
  /**
   * @event user:created
   * @description A user has been created
   */
  UserCreated = "user:created",

  /**
   * @event token:created
   * @description A token (email-verification / reset-password) has been created
   */
  TokenCreated = "token:created",
}
