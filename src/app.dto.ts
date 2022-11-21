import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ShortenUrlDto {
  @ApiProperty({ example: 'https://google.com' })
  @IsNotEmpty()
  @IsUrl()
  @IsString()
  public url: string;

  @ApiPropertyOptional({ example: 'google' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  public customTag?: string;
}

export class RedirectReturnData {
  @ApiProperty({ example: 'https://google.com' })
  public url: string;

  @ApiProperty({ example: 301 })
  public statusCode: string;
}

export class ShortURLReturnData {
  @ApiProperty({ example: 'clapy2enk0000mc0wamhdmx9a' })
  public id: string;

  @ApiProperty({ example: 'https://google.com' })
  public url: string;

  @ApiProperty({ example: 'google' })
  public tag: string;

  @ApiProperty({ example: '2022-11-20 22:25:38' })
  public createdAt: string;

  @ApiProperty({ example: '::ffff:10.10.10.10' })
  public ip: string;

  @ApiProperty({ example: 0 })
  public clicks: number;
}
