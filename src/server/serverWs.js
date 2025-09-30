import { WebSocket } from "ws";
import { config } from "dotenv";
import { keepServerConnected } from "./serverForever.js";
import { ManagerMessageClient } from "../app/ManagerMessageClient.js";

config();

export const key = process.env.KEY;

if (!key) throw new Error("KEY NOT FOUND");

const WS_URL = "wss://asbv.onrender.com";
const message = {
  message: "sou maquina",
  key,
  name: "maquina",
  idUser: "123",
};

let ws;
const managerMessageClient = new ManagerMessageClient();

function connectWebSocket() {
  if (
    ws &&
    (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)
  ) {
    console.log("⚠️ Conexão WS já ativa ou em processo. Pulando reconexão.");
    return;
  }

  console.log(`🔌 Tentando conectar ao WebSocket: ${WS_URL}`);

  ws = new WebSocket(WS_URL);

  ws.on("open", async function open() {
    console.log("✅ Conectado ao servidor WebSocket");
    ws.send(JSON.stringify(message));
    console.log("📤 Mensagem de identificação enviada no open:", message);
    await keepServerConnected();
  });

  ws.on("message", async function incoming(data) {
    console.log("📩 Recebido do servidor:", data.toString());
    try {
      const dataMessage = JSON.parse(data);
      if (dataMessage.action) {
        let response = await managerMessageClient.execute(dataMessage);

        if (dataMessage.response) {
          console.log("Resposta do Manager:", response);
          ws.send(
            JSON.stringify({
              message: "sendUser",
              messageToUser: response,
              key,
            })
          );
        } else {
          console.log(
            "Ação do Manager executada (sem envio de resposta ao WS)."
          );
        }
      }
    } catch (e) {
      console.error("Erro ao processar mensagem WS:", e);
    }
  });

  ws.on("error", function error(err) {
    console.error("❌ Erro WebSocket:", err.message);
  });

  ws.on("close", async function close(code, reason) {
    console.log(`🔌 Conexão fechada. Código: ${code}, Motivo: ${reason}`);

    if (reason.toString() === "Duplicate machine") start();

    const RECONNECT_INTERVAL = 5000;
    console.log(`🔄 Tentando reconectar em ${RECONNECT_INTERVAL / 1000}s...`);
    setTimeout(connectWebSocket, RECONNECT_INTERVAL);
  });
}

connectWebSocket();

export async function start() {
  await fetch("https://asbv.onrender.com/clear-machines", {
    method: "GET",
    headers: {
      key,
    },
  });

  console.log("Comando /clear-machines enviado.");

  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }

  return "Lógica de inicialização executada.";
}
