export enum ROLES {
  USER = "user",
  ASSISTANT = "assistant",
}
export interface IChatMessageType {
  role: ROLES;
  content: string;
}
