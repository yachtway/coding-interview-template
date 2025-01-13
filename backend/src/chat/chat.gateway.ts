import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server } from 'socket.io';
import { PrismaService } from 'src/prisma.service';

// Socket server URI is ws://localhost:3001/chat

@WebSocketGateway({ cors: true, namespace: 'chat' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly prismaService: PrismaService) {}

  @WebSocketServer() io: Server;

  afterInit() {
    console.log('Websocket Server initialized');
  }

  async handleConnection(client: any) {
    this.logger.log(`Client id: ${client.id} connected`);
    const sockets = await this.io.fetchSockets();
    this.logger.debug(`Number of connected clients: ${sockets.length}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client id: ${client.id} disconnected`);
  }

  // This subscribes an event on the 'message' channel
  // It expects a payload which is an object with the following properties:
  // - content: string
  // - channelId: string
  // - senderName: string (optional)
  @SubscribeMessage('message')
  async handleMessage(
    client: any,
    payload: {
      content: string;
      channelId: string;
      senderName?: string;
    },
  ) {
    if (!payload.content) {
      this.logger.error('Content is required');
      throw new Error('Content is required');
    }
    if (!payload.channelId) {
      this.logger.error('Channel ID is required');
      throw new Error('Channel ID is required');
    }
    this.logger.log(`Message received from client id: ${client.id}`);
    this.logger.debug(`Payload: ${payload}`);
    // Server emits event to all clients
    this.io.emit('message', payload);
    // Add message to database
    await this.prismaService.message.create({
      data: {
        content: payload.content,
        channelId: payload.channelId,
        // Defaults to "Anon" sender name
        senderName: payload.senderName || 'Anon',
      },
    });
    // Undefined return means no ack needed
    return;
  }
}
