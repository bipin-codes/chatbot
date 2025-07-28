import { Bot } from "./Bot.js";
import { InputManager } from "./InputManager.js";
import * as dotenv from "dotenv";

dotenv.config();

const start = async (im: InputManager, bot: Bot) => {
  while (true) {
    const input = await im.readInput();
    if (input.toLowerCase() === "quit") {
      console.log("Goodbye!");
      im.closeStream();
      break;
    }
    const result = await bot.process(input);
    console.log(result);
  }
};

const main = async () => {
  await start(new InputManager(), new Bot());
};

main().catch(console.error);
