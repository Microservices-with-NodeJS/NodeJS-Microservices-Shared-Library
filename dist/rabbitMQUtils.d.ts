/// <reference types="node" />
export declare function subscribeToRabbitMQ(exchange: string, routingKey: string, handleMessage: (message: Buffer) => void, rabbitMQConfig: {
    host: string;
    port: number;
    username: string;
    password: string;
}): Promise<void>;
export declare function publishToRabbitMQ(exchange: string, routingKey: string, message: string, rabbitMQConfig: {
    host: string;
    port: number;
    username: string;
    password: string;
}): Promise<void>;
//# sourceMappingURL=rabbitMQUtils.d.ts.map