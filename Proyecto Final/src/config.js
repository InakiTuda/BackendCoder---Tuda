import dotenv from "dotenv";

dotenv.config();

export default {
    port: process.env.PORT,
    mongo_uri: process.env.MONGO_URI,
    sessionSecret: process.env.SESSION_SECRET,
    gmail_user: process.env.GMAIL_USER,
    gmail_password: process.env.GMAIL_PASSWORD,
}