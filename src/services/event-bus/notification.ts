import singleConnection from "./connection";

export type INotification = {
    data: string;
    metadata?: string | undefined;
};

export const publish = async (routingKey: string, notification: INotification) => {
    console.log(`>>> sending notification to route ${routingKey} >>`);
    
    if (!routingKey || routingKey.length <= 0) {
        throw Error('Unable to send notification - routing key is invalid.');
    }
    
    await singleConnection.broadcast(routingKey, notification);

    console.log(`Sent the notification to consumer`);
};