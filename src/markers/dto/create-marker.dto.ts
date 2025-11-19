import { ApiProperty } from '@nestjs/swagger';
import { CrimeType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateMarkerDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  @MaxLength(250)
  description: string;

  @ApiProperty()
  @IsEnum(CrimeType)
  category: CrimeType;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  dateTime: Date;

  @ApiProperty()
  @IsNumber()
  latitude: number;

  @ApiProperty()
  @IsNumber()
  longitude: number;

  @ApiProperty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsNumber()
  bairroId: number;
}
