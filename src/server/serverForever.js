import { key } from "./serverWs.js";
async function requisitionToServer() {
  try {
    const response = await fetch("https://asbv.onrender.com/machines", {
      method: "GET",
      headers: { key },
    });

    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Requisição excedeu o tempo limite");
    }
    throw error;
  }
}
export async function keepServerConnected() {
  while (true) {
    await new Promise(async (resolve) => {
      await requisitionToServer();
      setTimeout(resolve, 5000);
    });
  }
}
