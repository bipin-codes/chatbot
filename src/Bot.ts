import { ChatOpenAI } from "@langchain/openai";
import { ROLES } from "./types.js";
import { ChatHistory } from "./history/ChatHistory.js";
import { BaseBot } from "./BaseBot.js";

export class Bot extends BaseBot {
  constructor(private chatHistory: ChatHistory) {
    super();
    this.chatHistory = chatHistory;
  }

  async promptWithHistory(input: string) {
    this.chatHistory.add(input, ROLES.USER);

    const result = await this.llm.invoke(this.chatHistory.getHistory());
    this.chatHistory.add(result.content.toString(), ROLES.ASSISTANT);

    return result.content.toString();
  }

  async prompt(msg: string) {
    const result = await this.llm.invoke(msg);
    return result.content.toString();
  }
}
