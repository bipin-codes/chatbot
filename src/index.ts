import { ChatOpenAI } from "@langchain/openai";
import {
  HumanMessage,
  AIMessage,
  MessageContent,
} from "@langchain/core/messages";
import * as dotenv from "dotenv";
import {
  END,
  MemorySaver,
  MessagesAnnotation,
  START,
  StateGraph,
} from "@langchain/langgraph";
import { v4 } from "uuid";

dotenv.config();
class ChatBot {
  private history: (HumanMessage | AIMessage)[];
  private llm: ChatOpenAI;
  private workflow;
  private memory;
  private app;

  private configurations;

  constructor() {
    this.history = [];

    this.llm = new ChatOpenAI({
      model: "gpt-4.1-mini",
      temperature: 0,
    });

    // Defining a new Graph
    this.workflow = new StateGraph(MessagesAnnotation)
      .addNode("model", async (state: typeof MessagesAnnotation.State) => {
        const response = await this.llm.invoke(state.messages);
        return { messages: response };
      })
      .addEdge(START, "model")
      .addEdge("model", END);

    // Initialise memory...
    this.memory = new MemorySaver();
    this.app = this.workflow.compile({ checkpointer: this.memory });

    this.configurations = [];
    this.configurations.push({ configurable: { thread_id: v4() } }); // this enables us to support multiple configurations...
  }

  add(role: "user" | "assistant", msg: MessageContent) {
    if (role === "user") {
      this.history.push(new HumanMessage(msg.toString()));
    } else {
      this.history.push(new AIMessage(msg.toString()));
    }
  }

  async invoke() {
    const result = await this.llm.invoke(this.history);
    return result;
  }

  async sendMessage(msg: string) {
    const output = await this.app.invoke(
      {
        messages: { role: "user", content: msg },
      },
      this.configurations[0]
    );

    const msgs = output.messages[output.messages.length - 1];
    console.log(msgs.content);
  }
}

const bot = new ChatBot();
const chat = ["Hi, I'm Bob!", "What's my name?"];
// for (const msg of chat) {
//   bot.add("user", msg);

//   const result = await bot.invoke();
//   bot.add("assistant", result.content);

//   console.log(`User: ${msg}`);
//   console.log(`Bot: ${result.content}`);
// }

// *********************** WITH LANGGRAPH ***********************
for (const msg of chat) {
  await bot.sendMessage(msg);
}
