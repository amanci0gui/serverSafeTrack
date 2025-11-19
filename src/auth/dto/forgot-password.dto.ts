import { ApiProperty } from "@nestjs/swagger";

export default class ForgotPasswordDto {
  @ApiProperty()
  email: string;
}