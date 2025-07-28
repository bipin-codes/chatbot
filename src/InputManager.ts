import { createInterface, Interface } from "readline";

export class InputManager {
  private rl: Interface;

  constructor() {
    this.rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  readInput(): Promise<string> {
    return new Promise((res) => {
      this.rl.question("Enter your message or 'quit' to exit\n", (value) => {
        res(value);
      });
    });
  }

  closeStream() {
    this.rl.close();
  }
}
