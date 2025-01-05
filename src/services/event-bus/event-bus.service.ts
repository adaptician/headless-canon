import {INotification, publish} from "./notification";

export class EventBusService {
    
    async publish(routingKey: string, data: string, metadata?: string) {
        const newNotification: INotification = {
            data: data,
            metadata: metadata
        };

        await publish(routingKey, newNotification);
    }
}