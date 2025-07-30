import {
  END,
  MemorySaver,
  MessagesAnnotation,
  START,
  StateGraph,
} from "@langchain/langgraph";
import { basicModel, modelWithPromptTemplate } from "./callmodels/models.js";
import { BaseBot } from "./BaseBot.js";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { GraphAnnotation } from "./types.js";

export class PromptTemplateGenerator {
  static piratePersonality() {
    return ChatPromptTemplate.fromMessages([
      [
        "system",
        "You talk like a pirate. Answer all questions to the best of your ability!",
      ],
      ["placeholder", "{messages}"],
    ]);
  }

  static multilingualAssistant() {
    return ChatPromptTemplate.fromMessages([
      [
        "system",
        "You are a helpful assistant. Answer all questions to the best of your abilities in {language}",
      ],
      ["placeholder", "{messages}"],
    ]);
  }
}

export class BotWithMemory extends BaseBot {
  private config;
  private workflow;
  private app;

  constructor(private id: string) {
    super();

    this.config = { configurable: { thread_id: this.id } };

    // this.workflow = new StateGraph(MessagesAnnotation)
    // .addNode("model", basicModel(this.llm))
    this.workflow = new StateGraph(GraphAnnotation)
      .addNode("model", modelWithPromptTemplate(this.llm))
      .addEdge(START, "model")
      .addEdge("model", END);

    this.app = this.workflow.compile({ checkpointer: new MemorySaver() });
  }

  async prompt(input: string, language?: string) {
    const { messages } = await this.app.invoke(
      {
        messages: [{ role: "user", content: input }],
        language: language || "spanish", // Add language at the top level
      },

      this.config
    );
    const len = messages.length;
    return messages[len - 1].content.toString();
  }
}
