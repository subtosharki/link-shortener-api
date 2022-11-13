import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ShortenUrlDto } from './app.dto';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}
  private async upTagClick(tag: string) {
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
    try {
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
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  public async getLink(tag: string) {
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
