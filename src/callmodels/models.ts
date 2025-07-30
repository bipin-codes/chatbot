import { MessagesAnnotation } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplateGenerator } from "../BotWithMemory.js";

export const basicModel =
  (llm: ChatOpenAI) => async (state: typeof MessagesAnnotation.State) => {
    const response = await llm.invoke(state.messages);
    return { messages: response };
  };

export const modelWithPromptTemplate =
  (llm: ChatOpenAI) => async (state: typeof MessagesAnnotation.State) => {
    const prompt = await PromptTemplateGenerator.multilingualAssistant().invoke(
      state
    );
    const response = await llm.invoke(prompt);
    return { messages: response };
  };
