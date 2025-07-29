import { Bot } from "./Bot.js";
import { ChatHistory } from "./history/ChatHistory.js";
import { InputManager } from "./InputManager.js";
import * as dotenv from "dotenv";
import { ROLES } from "./types.js";

dotenv.config();

const start = async (im: InputManager, ch: ChatHistory, bot: Bot) => {
  while (true) {
    const input = await im.readInput();
    if (input.toLowerCase() === "quit") {
      console.log("Goodbye!");
      im.closeStream();
      break;
    }
    console.log("****User input****");
    console.log(input);

    const result = await bot.promptWithHistory(input);

    console.log("****Agent response****");
    console.log(result);
  }
};

const main = async () => {
  const chatHistory = new ChatHistory();
  const im = new InputManager();
  const bot = new Bot(chatHistory);

  await start(im, chatHistory, bot);
};

main().catch(console.error);
