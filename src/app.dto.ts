import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ShortenUrlDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUrl()
  @IsString()
  url: string;
}
