export const dbUrl = "mongodb+srv://okwin:okwin123@okwincluster.0wkq50o.mongodb.net/?retryWrites=true&w=majority&appName=okwinCluster";
export const botToken = "7452865191:AAEt04_WZyd7mHkBjcRketJ1RWrxPMvWpBA";
export const admins = [6632694425, 5547959277]
export const cancelKeyboard = {
    reply_markup: {
        keyboard: [
            ['Cancel'],
        ],
        resize_keyboard: true,
        one_time_keyboard: true
    },
    parse_mode: "HTML"
};
export const predictionKeyboard = {
    reply_markup: {
        keyboard: [
            ['Get Prediction', 'Result'],
            ['Register Link', '🔙Back']
        ],
        resize_keyboard: true,
        one_time_keyboard: true
    },
    parse_mode: "HTML"
};
