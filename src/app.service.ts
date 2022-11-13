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
  public async generateShortenedLink({ url }: ShortenUrlDto, ip: string) {
    let re = new RegExp('^(http|https)://', 'i');
    if (!re.test(url)) {
      url = 'http://' + url;
    }
    re = new RegExp(
      '((([A-Za-z]{3,9}:(?:\\/\\/)?)(?:[-;:&=\\+\\$,\\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\\+\\$,\\w]+@)[A-Za-z0-9.-]+)((?:\\/[\\+~%\\/.\\w-_]*)?\\??(?:[-\\+=&;%@.\\w_]*)#?(?:[\\w]*))?)',
    );
    if (!re.test(url)) {
      throw new BadRequestException('Invalid URL');
    }
    try {
      return await this.prisma.shortUrl.create({
        data: {
          url,
          tag: this.genFiveLetterString(),
          ip,
        },
      });
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
    const longUrl = await this.prisma.shortUrl.findFirst({
      where: {
        tag,
      },
    });
    if (!longUrl) throw new BadRequestException('Invalid tag');
    return longUrl;
  }
}
