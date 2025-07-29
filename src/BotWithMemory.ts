import {
  END,
  MemorySaver,
  MessagesAnnotation,
  START,
  StateGraph,
} from "@langchain/langgraph";
import { basicModel } from "./callmodels/basicModel.js";
import { ChatOpenAI } from "@langchain/openai";

class BotWithMemory {
  private config;
  private workflow;
  private app;
  private llm;

  constructor(private id: string) {
    this.llm = new ChatOpenAI({
      model: "gpt-4.1-mini",
      temperature: 0,
    });

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

    console.log(messages);
  }
}
