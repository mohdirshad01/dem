import Channel from "./Channel.js";
import { bot } from "./server.js";
import { admins } from "./config.js";

export const askForChannelAndRemove = async (msg) => {
    const chatId = msg.message.chat.id || msg.chat.id;
    if (!admins.includes(chatId)) {
        bot.sendMessage(msg.from.id, "You are not authorized");
        return;
    }

    try {
        const botInfo = await bot.getMe();
        const botUsername = botInfo.username;
        await bot.sendMessage(chatId, 'Please enter the channel chat ID to remove:');
        const chatIdResponse = await new Promise((resolve) => {
            bot.once('message', (msg) => {
                resolve(msg.text);
            });
        });
        const channelChatId = chatIdResponse.trim();

        // Ask for channel link
        await bot.sendMessage(chatId, 'Please enter the channel link to remove:');
        const linkResponse = await new Promise((resolve) => {
            bot.once('message', (msg) => {
                resolve(msg.text);
            });
        });
        const channelLink = linkResponse.trim();
        const channelDocument = await Channel.findOne({ 'channels.chatId': channelChatId, 'channels.link': channelLink , botUsername: botUsername});
        if (!channelDocument) {
            await bot.sendMessage(chatId, `Channel with chat ID ${channelChatId} and link ${channelLink} not found.`);
            return null;
        }

        channelDocument.channels = channelDocument.channels.filter(channel => !(channel.chatId === channelChatId && channel.link === channelLink));
        await channelDocument.save();

        console.log('Channel removed successfully:', { chatId: channelChatId, link: channelLink });
        await bot.sendMessage(chatId, `Channel with chat ID ${channelChatId} and link ${channelLink} removed successfully.`);
        return channelDocument;
    } catch (error) {
        console.error('Error removing channel:', error.message);
        throw error;
    }
};
