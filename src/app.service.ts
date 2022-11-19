import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ShortenUrlDto } from './app.dto';
import type { ShortUrl } from '@prisma/client';
import { RedirectData } from '../types';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}
  private async upTagClick(tag: string): Promise<ShortUrl> {
    return await this.prisma.shortUrl.update({
      where: {
        tag,
      },
      data: {
        clicks: {
          increment: 1,
        },
      },
    });
  }
  private genFiveLetterString() {
    let string = '';
    for (let i = 0; i < 5; i++) {
      const random = Math.floor(Math.random() * 26);
      const letter = String.fromCharCode(97 + random);
      string += letter;
    }
    return string;
  }
  public async generateShortenedLink(
    { url, customTag }: ShortenUrlDto,
    ip: string,
  ) {
    if (!customTag) {
      return await this.prisma.shortUrl.create({
        data: {
          url,
          tag: this.genFiveLetterString(),
          ip,
        },
      });
    } else {
      const tagExists = await this.prisma.shortUrl.findFirst({
        where: {
          tag: customTag,
        },
      });
      if (tagExists) throw new BadRequestException('Tag already exists');
      return await this.prisma.shortUrl.create({
        data: {
          url,
          tag: customTag,
          ip,
        },
      });
    }
  }
  public async getLink(tag: string): Promise<RedirectData> {
    const longUrl = await this.prisma.shortUrl.findFirst({
      where: {
        tag,
      },
    });
    if (!longUrl) throw new BadRequestException('Invalid tag');
    await this.upTagClick(tag);
    return {
      url: longUrl.url,
      statusCode: 301,
    };
  }
  public async getUrlInfo(tag: string) {
    const urlInfo = await this.prisma.shortUrl.findFirst({
      where: {
        tag,
      },
    });
    if (!urlInfo) throw new BadRequestException('Invalid tag');
    return urlInfo;
  }
}
