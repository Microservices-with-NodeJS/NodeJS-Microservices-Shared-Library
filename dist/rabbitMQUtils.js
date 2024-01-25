"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishToRabbitMQ = exports.subscribeToRabbitMQ = void 0;
const amqp = __importStar(require("amqplib"));
// Subscribe to rabbitmq
async function subscribeToRabbitMQ(exchange, routingKey, handleMessage, rabbitMQConfig) {
    const connection = await amqp.connect({
        protocol: "amqp",
        hostname: rabbitMQConfig.host,
        port: rabbitMQConfig.port,
        username: rabbitMQConfig.username,
        password: rabbitMQConfig.password,
    });
    const channel = await connection.createChannel();
    await channel.assertExchange(exchange, "direct", { durable: false });
    const queue = await channel.assertQueue("", { exclusive: true });
    channel.bindQueue(queue.queue, exchange, routingKey);
    channel.consume(queue.queue, (msg) => {
        if (msg !== null && msg.content) {
            handleMessage(msg.content);
        }
    }, { noAck: true });
}
exports.subscribeToRabbitMQ = subscribeToRabbitMQ;
// Publish event to rabbitmq
async function publishToRabbitMQ(exchange, routingKey, message, rabbitMQConfig) {
    const connection = await amqp.connect({
        protocol: "amqp",
        hostname: rabbitMQConfig.host,
        port: rabbitMQConfig.port,
        username: rabbitMQConfig.username,
        password: rabbitMQConfig.password,
    });
    const channel = await connection.createChannel();
    await channel.assertExchange(exchange, "direct", { durable: false });
    // Publish the message to the exchange with the specified routing key
    channel.publish(exchange, routingKey, Buffer.from(message));
    // Close the connection
    await channel.close();
    await connection.close();
}
exports.publishToRabbitMQ = publishToRabbitMQ;
