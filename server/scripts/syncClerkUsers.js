import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import axios from "axios";
import connectDB from "../configs/db.js";
import User from "../models/User.js";

// Use your environment variable, not hardcoded
const clerkApiKey = process.env.CLERK_SECRET_KEY;
const webhookUrl = "https://project-pfe-backend.vercel.app/api/clerk";

async function syncUsers() {
    try {
        await connectDB(); // ensure DB connection before processing

        let offset = 0;
        let totalSynced = 0;

        while (true) {
            const response = await axios.get(`https://api.clerk.com/v1/users?limit=100&offset=${offset}`, {
                headers: {
                    Authorization: `Bearer ${clerkApiKey}`,
                },
            });

            const users = response.data;

            if (users.length === 0) break; // exit if no more users

            for (const user of users) {
                const payload = {
                    type: "user.created",
                    data: user,
                };

                try {
                    await axios.post(webhookUrl, payload);
                    console.log(`✅ Synced user ${user.id}`);
                    totalSynced++;
                } catch (err) {
                    console.error(`❌ Failed syncing user ${user.id}:`, err.response?.data || err.message);
                }
            }

            offset += users.length;
        }

        console.log(`✅ Finished syncing ${totalSynced} users.`);
        process.exit();
    } catch (err) {
        console.error("❌ Error in syncUsers:", err.message);
        process.exit(1);
    }
}

syncUsers();
