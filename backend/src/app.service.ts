import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private prismaService: PrismaService) {}

  getHello(): { message: string } {
    return { message: 'Your backend is running!' };
  }

  async getMessages(channelId: string) {
    if (!channelId) {
      throw new Error('Channel ID is required');
    }
    return await this.prismaService.message.findMany({
      where: {
        channelId,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getChannels() {
    const channels = await this.prismaService.channel.findMany();
    // Populate each channel with the most recent message
    for (const channel of channels) {
      const messages = await this.prismaService.message.findMany({
        where: {
          channelId: channel.id,
        },
        orderBy: { createdAt: 'desc' },
        take: 1,
      });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      /* @ts-ignore */
      channel.lastMessageSnippet = messages[0]?.content || '';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      /* @ts-ignore */
      channel.lastMessageCreatedAt = messages[0]?.createdAt || '';
    }
    return channels;
  }
}
