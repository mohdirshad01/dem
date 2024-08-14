import { bot } from "./server.js";
import User from "./User.js";
import Channel from "./Channel.js";

export async function Start(msg) {
    try {
        const botInfo = await bot.getMe();
        const botUsername = botInfo.username;
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        let checkUser = await User.findOne({ user_id: userId, botUsername: botUsername });
        if (!checkUser) {
            const newUser = new User({
                user_id: userId,
                isJoined: false,
                botUsername: botUsername
            });
            await newUser.save();
        }
        const channelsDoc = await Channel.findOne({botUsername: botUsername});
        const channels = channelsDoc ? channelsDoc.channels : [];
        let isMemberOfAllChannels = true;
        for (const channel of channels) {
            try {
                const chatMember = await bot.getChatMember(channel.chatId, userId);
                if (chatMember.status === 'left' || chatMember.status === 'kicked') {
                    isMemberOfAllChannels = false;
                    break;
                }
            } catch (error) {
                console.error(`Error checking membership for channel ${channel.chatId}:`, error);
                isMemberOfAllChannels = false;
                break;
            }
        }
        let startKeyBoardOpts;
        if (isMemberOfAllChannels) {
            startKeyBoardOpts = {
                reply_markup: {
                    keyboard: [
                        ['Prediction', 'Fund Management'],
                        ['₹50000 Gift Code', 'Free Deposit Bonus']
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true
                },
                parse_mode: "HTML"
            };
        } else {
            const channelButtons = [];
            for (let i = 0; i < channels.length; i += 2) {
                const row = [];
                const firstChannel = channels[i];
                const secondChannel = channels[i + 1] || null;

                if (firstChannel) {
                    row.push({ text: '📢 Join', url: firstChannel.link });
                }
                if (secondChannel) {
                    row.push({ text: '📢 Join', url: secondChannel.link });
                }
                channelButtons.push(row);
            }

            startKeyBoardOpts = {
                reply_markup: {
                    inline_keyboard: [
                        ...channelButtons,
                        [
                            { text: 'Verify', callback_data: 'check_join' }
                        ]
                    ]
                },
                parse_mode: 'HTML'
            };
        }
        const welcomeMessage = isMemberOfAllChannels
            ? `<b>👋Hey ${msg.chat.first_name} Welcome To Our Premium Prediction Bot!\n\nPlease select the Option Below</b>`
            : "<b>🛑 Must Join Total Channel To Use Our Bot</b>";

        // Send welcome message
        try {
            await bot.sendMessage(chatId, welcomeMessage, startKeyBoardOpts);
            console.log('Welcome message sent successfully');
        } catch (error) {
            console.error('Error sending welcome message:', error);
        }
    } catch (error) {
        console.error("Error in Start function:", error);
    }
}
