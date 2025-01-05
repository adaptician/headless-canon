import { sendNotification } from "./notification";

export class EventBusService {
    
    async send() {
        const newNotification = {
            title: "You have received new notification",
            description:
                "You have received new incmoing notification from the producer service",
        };

        await sendNotification(newNotification);
    }
}