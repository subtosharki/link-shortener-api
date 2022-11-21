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
import {
  ApiMovedPermanentlyResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  RedirectReturnData,
  ShortenUrlDto,
  ShortURLReturnData,
} from './app.dto';
import { ShortUrl } from '@prisma/client';
import { RedirectData } from '../types';

@ApiTags('Shorten URL')
@Controller()
export class AppController {
  public constructor(private readonly appService: AppService) {}
  @ApiMovedPermanentlyResponse({
    description: 'Get a shortened URL by the ID',
    type: RedirectReturnData,
  })
  @Get('/:id')
  @Redirect()
  @HttpCode(HttpStatus.PERMANENT_REDIRECT)
  public async getLink(@Param('id') tag: string): Promise<RedirectData> {
    return await this.appService.getLink(tag);
  }
  @ApiOkResponse({ description: 'Shorten a URL', type: ShortURLReturnData })
  @Post('/shorten-url')
  @UsePipes(new ValidationPipe())
  public async shortURL(
    @Body() body: ShortenUrlDto,
    @Ip() ip: string,
  ): Promise<ShortUrl> {
    return this.appService.generateShortenedLink(body, ip);
  }
  @ApiOkResponse({
    description: 'Returns data about a short URL',
    type: ShortURLReturnData,
  })
  @Get('/url-info/:tag')
  public async getUrlInfo(@Param('tag') tag: string): Promise<ShortUrl> {
    return await this.appService.getUrlInfo(tag);
  }
  @ApiOkResponse({
    description: 'Deletes the short URL',
    type: ShortURLReturnData,
  })
  @Delete('/:id')
  public async deleteUrl(
    @Param('id') tag: string,
    @Ip() ip: string,
  ): Promise<ShortUrl> {
    return await this.appService.deleteUrl(tag, ip);
  }
}
