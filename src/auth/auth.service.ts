import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { UserPayload } from './models/UserPayload';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './models/UserToken';
import { UnauthorizedError } from './errors/unauthorized.error';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  login(user: User): UserToken {
    //Transforma o user em um JWT
    const payload: UserPayload = {
      sub: user.id ?? 0,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    //gera o token jwt
    const jwtToken = this.jwtService.sign(payload);

    return {
      access_token: jwtToken,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (user?.active === false) {
      throw new UnauthorizedException('Conta desativada!');
    }

    if (user) {
      //Checar se a senha corresponde ao hash no banco
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        return {
          ...user,
          password: undefined,
        };
      }
    }

    //Se chegar aqui, não encontrou o user e/ou senha não corresponde
    throw new Error('Email adress or password provided is incorrect');
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const user = await this.prismaService.user.findUnique({ where: { email: changePasswordDto.email } });
    if (!user) throw new UnauthorizedError('Usuário não encontrado');
  
    const isMatch = await bcrypt.compare(changePasswordDto.oldPassword, user.password);
    if (!isMatch) throw new UnauthorizedError('Senha antiga incorreta');

    const hashedNewPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await this.prismaService.user.update({
      where: { email: changePasswordDto.email },
      data: { password: hashedNewPassword },
    });

    return { message: 'Senha alterada com sucesso' };
  }
}
