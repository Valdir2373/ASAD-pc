import { StartCommand } from "./command/StartCommand.js";
import { ConversorMp3 } from "./conversorMp3/conversor.js";
import { AI } from "./AI/AI.js";

export class ManagerMessageClient {
  constructor() {
    this.startCommand = new StartCommand();
    this.converterMp3 = new ConversorMp3();
    this.ai = new AI();
  }
  async execute(data) {
    switch (data.action) {
      case "ia":
        return await this.ai.execute(data.message);
      case "command":
        return this.startCommand.execute(data.message);
      case "mp3":
        return await this.converterMp3.execute(data.message);
    }
  }
}
