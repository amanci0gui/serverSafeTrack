import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { IsEnum, IsNumber, IsOptional } from "class-validator";

export default class ChangeRoleDto {
  @ApiProperty()
  @IsEnum(Role)
  role: Role;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  bairroId?: number | null;
}