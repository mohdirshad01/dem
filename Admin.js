import { bot } from "./server.js";
import { adminKeyboardOptions } from "./inline.js";
import { admins } from "./config.js";

export async function Admin(msg) {
    const chatId = msg.chat.id;
    if (!admins.includes(chatId)) {
        bot.sendMessage(msg.from.id, "You are not authorized");
        return;
    }
    const Message = "<b>Choose from below options:</b>";
    await bot.sendMessage(chatId, Message, adminKeyboardOptions);
}