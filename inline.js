import Channel from './Channel.js';
import {bot} from "./server.js"

const generateKeyboard = async () => {
    try {
        // Fetch channels from the database
        const botInfo = await bot.getMe();
        const botUsername = botInfo.username;
        const channelsDoc = await Channel.findOne({botUsername: botUsername});
        if (!channelsDoc) {
            throw new Error('No channel document found.');
        }

        const channels = channelsDoc.channels || [];

        // Generate the inline keyboard buttons
        const channelButtons = [];
        for (let i = 0; i < channels.length; i += 2) {
            const row = [];
            const firstChannel = channels[i];
            const secondChannel = channels[i + 1] || null;

            if (firstChannel && firstChannel.link) {
                row.push({ text: '📢 Join', url: firstChannel.link });
            }
            if (secondChannel && secondChannel.link) {
                row.push({ text: '📢 Join', url: secondChannel.link });
            }
            if (row.length > 0) {
                channelButtons.push(row);
            }
        }

        const startKeyBoardOpts = {
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

        return startKeyBoardOpts;
    } catch (error) {
        console.error('Error generating keyboard options:', error);
        throw error; // Rethrow the error after logging it
    }
};

export default generateKeyboard;

export const adminKeyboardOptions = {
    reply_markup: {
        inline_keyboard: [
            [
                { text: 'Add Channel', callback_data: 'add_channel' },
                { text: 'Remove Channel', callback_data: 'remove_channel' }
            ],
            [
                { text: 'Set Refer Link', callback_data: 'set_link' },
                { text: 'Broadcast', callback_data: 'broadcast' },
            ],
        ]
    },
    parse_mode: "HTML"
};
