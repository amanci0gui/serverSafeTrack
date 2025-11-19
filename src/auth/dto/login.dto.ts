import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email do usuário / username' })
  email: string;

  @ApiProperty({ example: 'senha123', description: 'Senha do usuário' })
  password: string;
}