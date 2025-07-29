import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { IChatMessageType, ROLES } from "../types.js";

export class ChatHistory {
  private messages: Array<HumanMessage | AIMessage>;

  constructor() {
    this.messages = [];
  }

  add(msg: string, role: ROLES) {
    if (role === ROLES.USER) {
      this.messages.push(new HumanMessage(msg.toString()));
    } else {
      this.messages.push(new AIMessage(msg.toString()));
    }
  }

  getHistory() {
    return [...this.messages];
  }
}
