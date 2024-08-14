import mongoose from "mongoose";

const linkSchema = new mongoose.Schema({
    link:{
        type: String,
        required: true
    },
    botUsername: {
        type: String,
        required: true
    }
})
const Link = mongoose.models.Link || mongoose.model("Link", linkSchema);
export default Link;