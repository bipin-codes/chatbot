import { ChatOpenAI } from "@langchain/openai";
import { ROLES } from "./types.js";
import { ChatHistory } from "./history/ChatHistory.js";

export class Bot {
  private llm: ChatOpenAI;

  constructor(private chatHistory: ChatHistory) {
    this.llm = new ChatOpenAI({
      model: "gpt-4.1-mini",
      temperature: 0,
    });

    this.chatHistory = chatHistory;
  }

  async promptWithHistory(input: string) {
    this.chatHistory.add(input, ROLES.USER);

    const result = await this.llm.invoke(this.chatHistory.getHistory());
    this.chatHistory.add(result.content.toString(), ROLES.ASSISTANT);

    return result.content;
  }

  async prompt(msg: string) {
    const result = await this.llm.invoke(msg);
    return result.content;
  }
}
