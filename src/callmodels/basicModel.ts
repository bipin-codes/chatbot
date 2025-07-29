import { MessagesAnnotation } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";

export const basicModel =
  (llm: ChatOpenAI) => async (state: typeof MessagesAnnotation.State) => {
    const response = await llm.invoke(state.messages);
    return { messages: response };
  };
