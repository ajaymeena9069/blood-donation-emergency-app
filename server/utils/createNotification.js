import Notification from "../models/notificationModel.js";

export const createNotification = async ({
    user,
    forRole,
    title,
    message,
    type,
    requestId,
    reason
}) => {
    try {
        const notification = await Notification.create({
            user,
            forRole,
            title,
            message,
            type,
            requestId,
            reason,
            isRead: false
        });

        return notification;
    } catch (error) {
        console.error("Error creating notification:", error);
        return null;
    }
};