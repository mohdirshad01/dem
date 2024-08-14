import mongoose from "mongoose";
import { dbUrl } from "./config.js";

export default async function connectToDb() {
    try {
        const connect = await mongoose.connect(dbUrl);
        const connection = mongoose.connection
        if (connection) {
            console.log(`Connected to Database`)
        } else {
            console.log(`Failed to connect to Database`)
        }
    }
    catch (error) {
        console.log(error)
    }
}