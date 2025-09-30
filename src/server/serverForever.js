import { key } from "./serverWs.js";
async function requisitionToServer() {
  const response = await fetch("https://asbv.onrender.com/machines", {
    method: "GET",
    headers: { key },
  });

  return await response.json();
}
export async function keepServerConnected() {
  while (true) {
    try {
      await new Promise(async (resolve) => {
        await requisitionToServer();
        setTimeout(resolve, 5000);
      });
    } catch (e) {}
  }
}
