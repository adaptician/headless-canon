import { env } from 'node:process';

import singleConnection from "./connection";

export type INotification = {
    title: string;
    description: string;
};

export const sendNotification = async (notification: INotification) => {
    const key = env.NOTIFICATION_QUEUE;
    console.log(`>>> sending notification to queue ${key} >>`);
    
    if (!key) {
        throw Error('Unable to send notification - queue is invalid.');
    }
    
    await singleConnection.publish(key, notification);

    console.log(`Sent the notification to consumer`);
};