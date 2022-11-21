import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ShortenUrlDto } from './app.dto';
import type { ShortUrl } from '@prisma/client';
import { RedirectData } from '../types';

@Injectable()
export class AppService {
  public constructor(private readonly prisma: PrismaService) {}
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
  private genFiveLetterString(): string {
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
  ): Promise<ShortUrl> {
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
    const [longUrl] = await Promise.all([
      this.prisma.shortUrl.findFirst({
        where: {
          tag,
        },
      }),
      this.upTagClick(tag),
    ]);
    if (!longUrl) throw new BadRequestException('Invalid tag');
    await this.upTagClick(tag);
    return {
      url: longUrl.url,
      statusCode: 301,
    };
  }
  public async getUrlInfo(tag: string): Promise<ShortUrl> {
    const urlInfo = await this.prisma.shortUrl.findFirst({
      where: {
        tag,
      },
    });
    if (!urlInfo) throw new BadRequestException('Invalid tag');
    return urlInfo;
  }
  public async deleteUrl(tag: string, ip: string): Promise<ShortUrl> {
    const urlInfo = await this.prisma.shortUrl.findFirst({
      where: {
        tag,
      },
      select: {
        ip: true,
      },
    });
    if (!urlInfo) throw new BadRequestException('Invalid tag');
    if (urlInfo.ip !== ip)
      throw new ForbiddenException(
        'Invalid Permissions (IP does not match URL owners IP)',
      );
    return await this.prisma.shortUrl.delete({
      where: {
        tag,
      },
    });
  }
}
