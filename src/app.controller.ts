import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Redirect,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/:id')
  @Redirect()
  @HttpCode(HttpStatus.PERMANENT_REDIRECT)
  async getLink(@Param('id') id: string) {
    return await this.appService.getLink(id);
  }
  @Post('/shorten-url')
  async shortURL(@Body('url') url: string) {
    return this.appService.generateShortenedLink(url);
  }
}
