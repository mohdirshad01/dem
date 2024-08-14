import User from "./User.js";
import { bot } from "./server.js";
import { admins } from "./config.js";
export async function Broadcast(msg) {
    const botInfo = await bot.getMe();
    const botUsername = botInfo.username;
    const chatId = msg.message.chat.id;
    if (!admins.includes(chatId)) {
        await bot.sendMessage(msg.from.id, "You are not authorized");
        return;
    }
    try {
        await bot.sendMessage(chatId, 'Please forward the message:');
        const forwardedMessage = await new Promise((resolve) => {
            bot.once('message', (msg) => {
                resolve(msg);
            });
        });
        let forwardedContent = '';
        if (forwardedMessage.text) {
            forwardedContent = forwardedMessage.text.trim();
        } else if (forwardedMessage.photo) {
            const photo = forwardedMessage.photo[forwardedMessage.photo.length - 1];
            const photoId = photo.file_id;
            forwardedContent = `photo:${photoId}`;
        } else {
            forwardedContent = 'Unsupported forwarded content';
        }
        const myUsers = await User.find({botUsername: botUsername});
        let count = 0;
        for (const user of myUsers) {
            try {
                if (forwardedMessage.photo) {
                    await bot.sendPhoto(
                        user.user_id,
                        forwardedMessage.photo[forwardedMessage.photo.length - 1].file_id,
                        { caption: `<b>${forwardedMessage.caption}</b>`, parse_mode: "HTML" }
                    );
                } else {
                    await bot.sendMessage(
                        user.user_id,
                        forwardedContent,
                        { parse_mode: "html" }
                    );
                }
                count++;
            } catch (err) {
                console.log("Error broadcasting message to a user: ", err);
            }
        }
        try {
            await bot.sendMessage(
                chatId,
                `<b>Successfully Broadcasted Your Message To ${count} Users ✅</b>`,
                { parse_mode: "html" }
            );
        } catch (err) {
            console.log("Error sending broadcast confirmation message: ", err);
        }
    } catch (error) {
        console.log("Error in Broadcast function: ", error);
    }
}
