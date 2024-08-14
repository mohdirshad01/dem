import Channel from "./Channel.js";
import { bot } from "./server.js";
import { admins } from "./config.js";

export const askForChannelAndSave = async (msg) => {
    const chatId = msg.message.chat.id;
    if (!admins.includes(chatId)) {
        await bot.sendMessage(msg.from.id, "You are not authorized");
        return;
    }

    try {
        // Ask for channel chat ID
        const botInfo = await bot.getMe();
        const botUsername = botInfo.username;

        await bot.sendMessage(chatId, 'Please enter the channel chat ID:');

        // Capture the channel chat ID
        const chatIdResponse = await new Promise((resolve) => {
            const handleMessage = (message) => {
                if (message.chat.id === chatId) {
                    bot.removeListener('message', handleMessage); // Remove listener after capturing the response
                    resolve(message.text);
                }
            };
            bot.on('message', handleMessage);
        });
        const channelChatId = chatIdResponse.trim();

        // Ask for channel link
        await bot.sendMessage(chatId, 'Please enter the channel link:');

        // Capture the channel link
        const linkResponse = await new Promise((resolve) => {
            const handleMessage = (message) => {
                if (message.chat.id === chatId) {
                    bot.removeListener('message', handleMessage); // Remove listener after capturing the response
                    resolve(message.text);
                }
            };
            bot.on('message', handleMessage);
        });
        const channelLink = linkResponse.trim();

        // Create channel object
        const channelToAdd = {
            chatId: channelChatId,
            link: channelLink,
            botUsername: botUsername
        };

        // Check if channel already exists
        const existingChannel = await Channel.findOne({
            botUsername: botUsername,
            'channels.chatId': channelChatId
        });

        if (existingChannel) {
            await bot.sendMessage(chatId, `Channel with chat ID ${channelChatId} already exists.`);
            return existingChannel;
        } else {
            let channelDocument = await Channel.findOne({ botUsername: botUsername });
            if (!channelDocument) {
                channelDocument = new Channel({
                    botUsername: botUsername,
                    channels: [channelToAdd]
                });
            } else {
                channelDocument.channels.push(channelToAdd);
            }
            await channelDocument.save();
            console.log('Channel added successfully:', channelToAdd);
            await bot.sendMessage(chatId, `Channel with chat ID ${channelChatId} added successfully.`);
            return channelDocument;
        }
    } catch (error) {
        console.error('Error adding channel:', error);
        await bot.sendMessage(chatId, `An error occurred: ${error.message}`);
        throw error; // Rethrow the error to be handled elsewhere
    }
};
