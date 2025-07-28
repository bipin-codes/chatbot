import { ChatOpenAI } from "@langchain/openai";
import { IChatMessageType, ROLES } from "./types.js";

class ChatHistory {
  private messages: Array<IChatMessageType>;

  constructor() {
    this.messages = [];
  }

  add(msg: string, role: ROLES) {
    this.messages.push({ role: role, content: msg });
  }

  getHistory() {
    return this.messages;
  }
}

export class Bot {
  private llm: ChatOpenAI;
  private chatHistory: ChatHistory;

  constructor() {
    this.llm = new ChatOpenAI({
      model: "gpt-4.1-mini",
      temperature: 0,
    });

    this.chatHistory = new ChatHistory();
  }

  async process(msg: string) {
    this.chatHistory.add(msg, ROLES.USER);

    const response = await this.promptWithHistory(
      this.chatHistory.getHistory()
    );

    this.chatHistory.add(msg, ROLES.ASSISTANT);
    return response;
  }

  private async promptWithHistory(history: Array<any>) {
    const result = await this.llm.invoke(history);
    return result.content;
  }
  private async prompt(msg: string) {
    const result = await this.llm.invoke(msg);
    return result.content;
  }
}
