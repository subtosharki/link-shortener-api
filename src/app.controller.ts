import {
  Body,
  Controller,
  Delete,
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
  public constructor(private readonly appService: AppService) {}
  @Get('/:id')
  @Redirect()
  @HttpCode(HttpStatus.PERMANENT_REDIRECT)
  public async getLink(@Param('id') tag: string): Promise<RedirectData> {
    return await this.appService.getLink(tag);
  }
  @Post('/shorten-url')
  @UsePipes(new ValidationPipe())
  public async shortURL(
    @Body() body: ShortenUrlDto,
    @Ip() ip: string,
  ): Promise<ShortUrl> {
    return this.appService.generateShortenedLink(body, ip);
  }
  @Get('/url-info/:id')
  public async getUrlInfo(@Param('id') tag: string): Promise<ShortUrl> {
    return await this.appService.getUrlInfo(tag);
  }
  @Delete('/:id')
  public async deleteUrl(
    @Param('id') tag: string,
    @Ip() ip: string,
  ): Promise<ShortUrl> {
    return await this.appService.deleteUrl(tag, ip);
  }
}
