import { ApiProperty } from '@nestjs/swagger';

export class VerifyResetTokenDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  token: string;
}