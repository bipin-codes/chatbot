import { Bot } from "./Bot.js";
import { ChatHistory } from "./history/ChatHistory.js";
import { InputManager } from "./InputManager.js";
import * as dotenv from "dotenv";
import { ROLES } from "./types.js";
import { BaseBot, IBot } from "./BaseBot.js";
import { BotWithMemory } from "./BotWithMemory.js";
import { v4 } from "uuid";

dotenv.config();

const start = async (im: InputManager, ch: ChatHistory, bot: IBot) => {
  while (true) {
    const input = await im.readInput();
    if (input.toLowerCase() === "quit") {
      console.log("Goodbye!");
      im.closeStream();
      break;
    }
    console.log("****User input****");
    console.log(input);

    let result = "";

    if (bot.promptWithHistory) {
      result = await bot.promptWithHistory(input);
    } else {
      result = await bot.prompt(input);
    }

    console.log("****Agent response****");
    console.log(result);
  }
};

const main = async () => {
  const chatHistory = new ChatHistory();
  const im = new InputManager();
  // const bot = new Bot(chatHistory);
  const bot = new BotWithMemory(v4());

  await start(im, chatHistory, bot);
};

main().catch(console.error);
