import { ChatOpenAI } from "@langchain/openai";
import {
  HumanMessage,
  AIMessage,
  MessageContent,
  trimMessages,
} from "@langchain/core/messages";
import * as dotenv from "dotenv";
import {
  Annotation,
  END,
  MemorySaver,
  MessagesAnnotation,
  START,
  StateGraph,
} from "@langchain/langgraph";
import { v4 } from "uuid";
import { ChatPromptTemplate } from "@langchain/core/prompts";

dotenv.config();

class ChatTrimmer {
  static trimChatMessages() {
    return trimMessages({
      maxTokens: 1,
      strategy: "last",
      tokenCounter: (msgs) => msgs.length,
      includeSystem: true,
      allowPartial: false,
      startOn: "human",
    });
  }
}

class PromptTemplateGenerator {
  static getTemplatePirate() {
    return ChatPromptTemplate.fromMessages([
      [
        "system",
        "You talk like a pirate. Answer all questions to the best of your ability",
      ],
      ["placeholder", "{messages}"],
    ]);
  }
  static getTemplateAssistant() {
    return ChatPromptTemplate.fromMessages([
      [
        "system",
        "You are a helpful assistant. Answer all questions to the best of your ability in {language}",
      ],
      ["placeholder", "{messages}"],
    ]);
  }
}

const GraphAnnotation = Annotation.Root({
  ...MessagesAnnotation.spec,
  language: Annotation<string>(),
});

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
    // this.workflow = new StateGraph(MessagesAnnotation)
    // ***** WITHOUT TEMPLATE ****
    // .addNode("model", async (state: typeof MessagesAnnotation.State) => {
    //   const response = await this.llm.invoke(state.messages);
    //   return { messages: response };
    // })

    this.workflow = new StateGraph(GraphAnnotation)
      .addNode("model", async (state: typeof GraphAnnotation.State) => {
        await ChatTrimmer.trimChatMessages().invoke(state.messages); // For Trimming messages
        const prompt =
          await PromptTemplateGenerator.getTemplateAssistant().invoke(state);
        const response = await this.llm.invoke(prompt);
        return { messages: [response] };
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
        language: "English",
      },
      this.configurations[0]
    );

    const msgs = output.messages[output.messages.length - 1];
    console.log(msgs.content);
  }
}

const bot = new ChatBot();
const chat = ["Hi, I'm Bob!", "Good day!", "What's my name?"];
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
