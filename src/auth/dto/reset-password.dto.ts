import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ResetPasswordDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string; 
  @ApiProperty()
  @IsNotEmpty()
  token: string; 
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  newPassword: string
}