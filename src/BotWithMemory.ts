import {
  END,
  MemorySaver,
  MessagesAnnotation,
  START,
  StateGraph,
} from "@langchain/langgraph";
import { basicModel } from "./callmodels/basicModel.js";
import { ChatOpenAI } from "@langchain/openai";
import { BaseBot } from "./BaseBot.js";

export class BotWithMemory extends BaseBot {
  private config;
  private workflow;
  private app;

  constructor(private id: string) {
    super();

    const memory = new MemorySaver();
    this.config = { configurable: { thread_id: this.id } };

    this.workflow = new StateGraph(MessagesAnnotation)
      .addNode("model", basicModel(this.llm))
      .addEdge(START, "model")
      .addEdge("model", END);

    this.app = this.workflow.compile({ checkpointer: memory });
  }

  async prompt(input: string) {
    const { messages } = await this.app.invoke(
      {
        messages: { role: "user", content: input },
      },
      this.config
    );
    const len = messages.length;
    return messages[len - 1].content.toString();
  }
}
