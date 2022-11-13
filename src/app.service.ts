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
  private genFiveLetterString() {
    let string = '';
    for (let i = 0; i < 5; i++) {
      const random = Math.floor(Math.random() * 26);
      const letter = String.fromCharCode(97 + random);
      string += letter;
    }
    return string;
  }
  public async generateShortenedLink({ url }: ShortenUrlDto) {
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
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  public async getLink(tag: string) {
    const url = await this.prisma.shortUrl.findFirst({
      where: {
        tag,
      },
    });
    if (!url) throw new BadRequestException('Invalid tag');
    return {
      url,
      statusCode: 301,
    };
  }
}
