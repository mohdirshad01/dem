import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
    channels: {
        type: Array,
        required: true
    },
    botUsername: {
        type: String,
        required: true
    }
});
const Channel = mongoose.models.Channel || mongoose.model('Channel', channelSchema);
export default Channel;