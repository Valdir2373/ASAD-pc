import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import qrcode from "qrcode-terminal";
import { start } from "../../server/serverWs.js";
import { ConversorMp3 } from "../conversorMp3/conversor.js";

const client = new Client({
  authStrategy: new LocalAuth(),
});

const conversorMp3 = new ConversorMp3();

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
  console.log("QR RECEIVED", qr);
});

client.on("ready", () => {
  console.log("Client is ready! O WhatsApp está conectado.");
});

client.on("message", async (msg) => {
  if (typeof msg.body === "string") {
    if (msg.body.includes("getMp3:")) {
      const link = msg.body.split("getMp3:")[1];
      const mp3Link = await conversorMp3.execute(link);
      msg.reply(mp3Link.message);
    }
  }
  console.log(`Mensagem de ${msg.from} recebida: ${msg.body}`);
});

client.on("message_create", async (msg) => {
  if (typeof msg.body === "string") {
    if (msg.body.includes("getMp3:")) {
      const link = msg.body.split("getMp3:")[1];
      const mp3Link = await conversorMp3.execute(link);
      msg.reply(mp3Link.message);
    }
    if (msg.body === "start") {
      await start();
      msg.reply("iniciado");
    }
  }
  console.log(`Mensagem de ${msg.from} recebida: ${msg.body}`);
});

export default client;
