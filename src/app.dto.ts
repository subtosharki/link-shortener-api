import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ShortenUrlDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUrl()
  @IsString()
  url: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  customTag?: string;
}
