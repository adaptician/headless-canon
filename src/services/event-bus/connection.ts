import client, { Connection, Channel, ConsumeMessage } from "amqplib";

import { env } from 'node:process';

export interface IEventBusConnection {
    connection: Connection;
    channel: Channel;

    publish(routingKey: string, message: any): Promise<void>;
}

class RabbitMQConnection implements IEventBusConnection {
    connection!: Connection;
    channel!: Channel;
    private connected!: Boolean;

    private async _connect() {
        if (this.connected && this.channel) return;
        else this.connected = true;

        try {
            console.log(`⌛️ Connecting to Rabbit-MQ Server`);
            this.connection = await client.connect(
                `amqp://${env?.BUS_USERNAME ?? 'guest'}:${env?.BUS_PASSWORD ?? 'guest'}@${env?.BUS_HOST ?? ''}:${env.BUS_COMMUNICATION_PORT}`
            );

            console.log(`✅ Rabbit MQ Connection is ready`);

            this.channel = await this.connection.createChannel();

            console.log(`🛸 Created RabbitMQ Channel successfully`);
        } catch (error) {
            console.error(error);
            console.error(`Not connected to MQ Server`);
        }
    }

    async publish(routingKey: string, message: any): Promise<void> {
        try {
            if (!this.channel) {
                await this._connect();
            }

            const exchangeName = 'cannon-test'; // Name of the exchange
            const exchangeType = 'fanout'; // Type of exchange (fanout for broadcasting)
            
            await this.channel.assertExchange(exchangeName, exchangeType, { durable: true });
            console.log(`Exchange "${exchangeName}" of type "${exchangeType}" is ready`);
            
            console.log(`>>> ... sending to ${routingKey} message: ${JSON.stringify(message)} >>`);
            this.channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(message)));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

const singleConnection = new RabbitMQConnection();

export default singleConnection;