import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

export class StartCommand {
  async execute(input) {
    try {
      const { stdout } = await execPromise(input);

      console.log(stdout);

      return { message: stdout.trim() };
    } catch (err) {
      const errorDetails = err.stderr || err.message;
      console.error("Erro na execução do comando:", errorDetails);
      throw new Error(
        `Falha na execução do comando. Detalhes: ${errorDetails}`
      );
    }
  }
}
