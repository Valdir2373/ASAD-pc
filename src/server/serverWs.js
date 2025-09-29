import { WebSocket } from "ws";
import { keepServerConnected } from "./serverForever.js";
import { ManagerMessageClient } from "../app/ManagerMessageClient.js";

export const key = process.env.KEY || "NOT KEY FOUND";

const WS_URL = "wss://asbv.onrender.com";
const message = {
  message: "sou maquina",
  key,
  name: "maquina",
  idUser: "123",
};

const ws = new WebSocket(WS_URL);

/**
 * @ManagerMessageClient {managerMessageClient}
 */
const managerMessageClient = new ManagerMessageClient();

export function start() {
  ws.on("open", async function open() {
    console.log("✅ Conectado ao servidor WebSocket");
    ws.send(JSON.stringify(message));
    console.log("📤 Mensagem enviada:", message);
    await keepServerConnected();
  });

  ws.on("message", async function incoming(data) {
    console.log("📩 Recebido do servidor:", data.toString());
    try {
      const dataMessage = JSON.parse(data);
      if (dataMessage.action && !dataMessage.response) {
        await managerMessageClient.execute(dataMessage);
      } else if (dataMessage.action && dataMessage.response) {
        const response = await managerMessageClient.execute(dataMessage);
        console.log(response);

        ws.send(
          JSON.stringify({ message: "sendUser", messageToUser: response, key })
        );
      }
    } catch (e) {
      console.error(e);
    }
  });

  ws.on("error", function error(err) {
    console.error("❌ Erro WebSocket:", err.message);
  });

  ws.on("close", function close(code, reason) {
    console.log(`🔌 Conexão fechada. Código: ${code}, Motivo: ${reason}`);
  });
}
