import userModel from "../models/user.model.js";
import { Webhook } from "svix";
export const clerkWebHook = async (req, res) => {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error("WebHook secret needed");
    }

    const payload = req.body;
    const headers = req.headers;

    console.log("Received Payload:", payload);
    console.log("Received Headers:", headers);

    const wh = new Webhook(WEBHOOK_SECRET);
    let evt;
    try {
        evt = wh.verify(payload, headers);
    } catch (err) {
        console.error("Webhook verification failed:", err);
        return res.status(400).json({
            message: "Webhook verification failed"
        });
    }

    // console.log("Verified Event:", evt);

    if (evt.type === "user.created") { // Note: Clerk uses "user.created" as the event type
        const newUser = new userModel({
            clerkUserId: evt.data.id,
            username: evt.data.username || evt.data.email_addresses[0].email_address,
            email: evt.data.email_addresses[0].email_address,
            img: evt.data.profile_image_url
        });

        await newUser.save();
        // console.log("New User Saved:", newUser);
    }
    if(evt.type==="user.deleted"){
        const deletedUser = await userModel.findOneAndDelete({
            clerkUserId:evt.data.Id
        });

    
    }

    return res.status(200).json({
        message: "WebHook received"
    });
};