import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('messages/:channelId')
  getMessages(@Param('channelId') channelId: string) {
    return this.appService.getMessages(channelId);
  }

  @Get('channels')
  getChannels() {
    return this.appService.getChannels();
  }
}
