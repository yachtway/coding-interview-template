import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('message')
  getHello() {
    return this.appService.getHello();
  }

  @Get('messages')
  getMessagesDefault() {
    return this.appService.getMessages();
  }

  @Get('messages/:channelId')
  getMessages(@Param('channelId') channelId: string) {
    return this.appService.getMessages(channelId);
  }

  @Get('channels')
  getChannels() {
    return this.appService.getChannels();
  }
}
