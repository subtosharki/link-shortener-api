import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Param,
  Post,
  Redirect,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { ShortenUrlDto } from './app.dto';
import { ShortUrl } from '@prisma/client';
import { RedirectData } from '../types';

@ApiTags('Shorten URL')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('/:id')
  @Redirect()
  @HttpCode(HttpStatus.PERMANENT_REDIRECT)
  async getLink(@Param('id') tag: string): Promise<RedirectData> {
    return await this.appService.getLink(tag);
  }
  @Post('/shorten-url')
  @UsePipes(new ValidationPipe())
  async shortURL(
    @Body() body: ShortenUrlDto,
    @Ip() ip: string,
  ): Promise<ShortUrl> {
    return this.appService.generateShortenedLink(body, ip);
  }
  @Get('/url-info/:id')
  async getUrlInfo(@Param('id') tag: string): Promise<ShortUrl> {
    return await this.appService.getUrlInfo(tag);
  }
}
