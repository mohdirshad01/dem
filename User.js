import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    isJoined: {
        type: Boolean,
        required: true,
        default: false,
    },
    botUsername: {
        type: String,
        required: true
    }
});
const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;