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

@ApiTags('Shorten URL')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('/:id')
  @Redirect()
  @HttpCode(HttpStatus.PERMANENT_REDIRECT)
  async getLink(@Param('id') tag: string) {
    return await this.appService.getLink(tag);
  }
  @Post('/shorten-url')
  @UsePipes(new ValidationPipe())
  async shortURL(@Body() body: ShortenUrlDto, @Ip() ip: string) {
    return this.appService.generateShortenedLink(body, ip);
  }
}
