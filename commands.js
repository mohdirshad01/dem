import { Start } from "./Start.js";
import { bot } from "./server.js";
import { askForChannelAndSave } from "./addChannel.js";
import { askForChannelAndRemove } from "./removeChannel.js";
import { Admin } from "./Admin.js";
import { VerifyUser } from "./verifyMember.js";
import fundManagement from "./fundManagement.js";
import { Back, Cancel } from "./Cancel.js";
import { setLink } from "./setLink.js";
import { Prediction } from "./Prediction.js";
import { getNewPrediction } from "./getPrediction.js";
import { getNewResult } from "./getResult.js";
import { registerLink } from "./registerLink.js";
import { giftCode } from "./giftCode.js";
import { depositBonus } from "./depositBonus.js";
import { Broadcast } from "./Broadcast.js";

export async function Commands() {
    bot.onText(/\/start/, Start);
    bot.onText(/\/admin/, Admin);
    bot.onText(/Fund Management/,fundManagement);
    bot.onText(/Cancel/,Cancel);
    bot.onText(/🔙Back/,Back);
    bot.onText(/Prediction/,Prediction);
    bot.onText(/Get Prediction/,getNewPrediction);
    bot.onText(/Result/, getNewResult);
    bot.onText(/Register Link/,registerLink);
    bot.onText(/₹50000 Gift Code/, giftCode);
    bot.onText(/Free Deposit Bonus/,depositBonus);
    bot.on('callback_query', (callbackQuery) => {
        const data = callbackQuery.data;
        switch (data) {
            case 'add_channel':
                askForChannelAndSave(callbackQuery);
                break;
            case 'remove_channel':
                askForChannelAndRemove(callbackQuery);
                break;
            case 'check_join':
                VerifyUser(callbackQuery);
                break;
            case 'set_link':
                setLink(callbackQuery);
                break;
            case 'broadcast':
                Broadcast(callbackQuery);
                break;
            default:
                console.error('Unknown callback query data:', data);
        }
    });
}
