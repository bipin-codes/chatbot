import { ChatOpenAI } from "@langchain/openai";

export interface IBot {
  prompt(input: string, language?: string): Promise<string>;
  promptWithHistory?(input: string): Promise<string>;
}

export abstract class BaseBot implements IBot {
  protected llm: ChatOpenAI;

  constructor() {
    this.llm = new ChatOpenAI({
      model: "gpt-4.1-mini",
      temperature: 0,
    });
  }
  abstract prompt(input: string): Promise<string>;
}
