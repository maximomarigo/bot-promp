require("dotenv").config();
const { createBot, createProvider, createFlow } = require("@bot-whatsapp/bot");
const QRPortalWeb = require("@bot-whatsapp/portal");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const MySQLAdapter = require('@bot-whatsapp/database/mysql');


/**
 * Base de Datos
 */
const MYSQL_DB_HOST = '127.0.0.1';
const MYSQL_DB_USER = 'root';
const MYSQL_DB_PASSWORD = 'contraseña';
const MYSQL_DB_NAME = 'chatbot_gescom';
const MYSQL_DB_PORT = '3308';

const adapterDB = new MySQLAdapter({
    host: MYSQL_DB_HOST,    
    user: MYSQL_DB_USER,
    database: MYSQL_DB_NAME,
    password: MYSQL_DB_PASSWORD,
    port: MYSQL_DB_PORT,
});
/**
 * ChatGPT
 */
const ChatGPTClass = require("./chatgpt.class");
const chatGPT = new ChatGPTClass();

/**
 * Flows
 */
const flowPrincipal = require("./flows/flowPrincipal");
const flowAgente = require("./flows/flowAgente");
const { flowReparacion } = require("./flows/flowReparacion");
const { flowOfertas } = require("./flows/flowOfertas");

/**
 * Funcion principal
 */
const main = async () => {
  

  const adapterFlow = createFlow([
    flowPrincipal,
    flowAgente,
    flowReparacion(chatGPT),
    flowOfertas(chatGPT),
  ]);
  
  const adapterProvider = createProvider(BaileysProvider);

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  QRPortalWeb();
};

main();
