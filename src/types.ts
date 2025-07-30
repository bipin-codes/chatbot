import { Annotation, MessagesAnnotation } from "@langchain/langgraph";

export enum ROLES {
  USER = "user",
  ASSISTANT = "assistant",
}
export interface IChatMessageType {
  role: ROLES;
  content: string;
}

export const GraphAnnotation = Annotation.Root({
  ...MessagesAnnotation.spec,
  language: Annotation<string>(),
});
