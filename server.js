import express from "express";
import TelegramBot from "node-telegram-bot-api";
import cors from "cors";
import { botToken } from "./config.js";
import { Commands } from "./commands.js";
import connectToDb from "./db.js";
connectToDb();
const app = express();
function getRandomPort() {
    const min = 1000;
    const max = 9999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const PORT = getRandomPort();
app.use(cors());
export const bot = new TelegramBot(botToken, { polling: true });
Commands()

app.listen(PORT, () => console.log(`Server is listening to PORT ${PORT}`));