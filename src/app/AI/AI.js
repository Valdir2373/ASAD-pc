import puppeteer from "puppeteer";
import { exec } from "child_process";
import { ConversorMp3 } from "../conversorMp3/conversor.js";

let indexOfPrompt = 0;
let browser;
let page;

export class AI {
  constructor() {
    this.browserDefault = "D:\\browser\\zen.exe";

    this.appsDefaultsFromUser = [
      {
        app: "postman",
        path: "C:\\Users\\vava\\AppData\\Local\\Postman\\Postman.exe",
      },
      {
        app: "filmes online",
        path: "C:\\Users\\vava\\Desktop\\programming\\novo\\filmes-online\\src\\start.bat",
      },
    ];

    this.projects = [
      {
        name: "conversor youtube para mp3",
        howUse:
          'use o comando: node "caminho do projeto" "o que eu quero fazer"',
        path: "C:\\Users\\vava\\Desktop\\programming\\ASBV\\ASBV\\asbv_PC\\conversor.js",
      },
    ];
  }
  prompt = (pedido) => {
    const appsList = this.appsDefaultsFromUser
      .map((app) => `"${app.app}"`)
      .join(", ");
    const browserInfo = this.browserDefault
      ? `Use SEMPRE este caminho do navegador para pesquisas: "${this.browserDefault}". Formate a URL corretamente (Google ou YouTube) e NÃO inclua espaços ou caracteres que quebrem o comando.`
      : "";
    const projectsList = this.projects
      .map((project) => `"${project.name}"`)
      .join(", ");
    const promptPoject = this.projects.length
      ? `Tenho projetos que programei, e quero executar, quando eu pedir para você alguma função que talvez esteja nos meus projetos, como por exemplo: ${projectsList}. você deve me enviar um json: {"action":"project","name":"nome do projeto","parametters":"mais os meus parametros, caso eu peça mais de um parametro, pode enviar um array"}`
      : "";
    return `Aja como um assistente que responde exclusivamente em JSON. Regras: 1) Se for CMD: {"action":"command","command":"comando"} 2) Se for pesquisa: gere URL codificada do Google ou YouTube e use {"action":"search","search":"${this.browserDefault} \\"URL\\""} 3) Só use {"action":"appDefault","appDefault":"nome"} se o usuário pedir EXPLICITAMENTE um destes apps: ${appsList}. Não invente caminhos. 4). ${promptPoject}. NUNCA inclua texto extra — só o JSON dentro de .code-container. Contexto: ${browserInfo} Pedido: "${pedido}" \n`;
  };

  async execute(order) {
    try {
      if (!browser || !page) {
        browser = await puppeteer.launch({ headless: false });
        page = await browser.newPage();
        await page.goto("https://gemini.google.com/app", {
          waitUntil: "networkidle2",
        });
      }
      const inputSelector = ".ql-editor.textarea";
      await page.waitForSelector(inputSelector, { timeout: 5000 });
      const pedido = indexOfPrompt === 0 ? this.prompt(order) : order + "\n";
      await page.type(inputSelector, pedido);
      const sendButtonSelector = ".send-button";
      await page.waitForSelector(sendButtonSelector, { timeout: 9000 });
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await page.waitForSelector(".code-container", { timeout: 9000 });
      const textContentIa = await page.evaluate((promptIndex) => {
        const codeElement =
          document.querySelectorAll(".code-container")[promptIndex];
        if (codeElement) {
          return codeElement.textContent.trim();
        }
        return null;
      }, indexOfPrompt);
      if (textContentIa) {
        await this.executeOrder(textContentIa);
        indexOfPrompt++;
        return textContentIa;
      } else {
        await IA(order);
      }
    } catch (error) {
      console.error("Ocorreu um erro:", error);
    } finally {
      if (browser) {
        console.log("Navegador fechado.");
      }
    }
  }

  async executeOrder(json) {
    const order = JSON.parse(json);
    console.log(order);

    const { action } = order;
    switch (action) {
      case "search":
        exec(order.search);
        break;
      case "command":
        exec(order.command);
        break;
      case "appDefault":
        const { appDefault } = order;
        const app = this.executeAppDefault(appDefault);

        exec(app);
        break;
      case "project":
        this.executeProjects(order);
        break;
    }
  }

  executeAppDefault(appDefault) {
    for (const app of this.appsDefaultsFromUser) {
      if (app.app === appDefault.toLowerCase()) {
        return app.path;
      }
    }
    return false;
  }

  async executeProjects(project) {
    switch (project.name) {
      case "conversor youtube para mp3":
        const conversorMp3 = new ConversorMp3();
        await conversorMp3.execute(project.parametters);
        break;
    }
    console.log(project);
  }
}
