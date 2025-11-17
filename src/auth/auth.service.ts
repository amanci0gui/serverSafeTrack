import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { UserPayload } from './models/UserPayload';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './models/UserToken';
import { UnauthorizedError } from './errors/unauthorized.error';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  private resetCodes = new Map<string, { token: string; tokenExpiry: number }>();

  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async login(user: User): Promise<UserToken> {

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

  async updateFirstLoginStatus(userId: number){

    const user = await this.prismaService.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('Usuário nao encontrado');

    if (user.isFirstLogin === false) return;

    await this.prismaService.user.update({
      where: { id: userId },
      data: { isFirstLogin: false },
    })

    if (user.role === 'REPRESENTANTE' || user.role === 'ADMIN') {
      return;
    }

    return { message: 'Vimos que é sua primeira vez logando no sistema. Bem vindo! Recomendamos que troque a senha que o representante te atribuiu por questões de segurança.'}
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

  async forgotPassword(email: string) {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user) return { message: 'Se o email existir, um token de reset será enviado.' };

    const token = Math.floor(100000 + Math.random() * 900000).toString(); 
    const tokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutos
    this.resetCodes.set(email, { token, tokenExpiry });

    //Aqui será colocado o serviço de envio de email
    await this.mailerService.sendMail({
      to: email,
      subject: 'SafeTrack - Código de Redefinição de Senha',
      template: 'reset-code', // nome do arquivo de template
      context: {
        name: user.name,
        code: token,
      },
    })

    return { message: 'Código enviado por email!' };
  }

  async verifyResetToken(email: string, token: string) {
    const data = this.resetCodes.get(email);
    if (!data || data.token !== token || Date.now() > data.tokenExpiry)
          throw new BadRequestException('Código inválido ou expirado');

    const tokenTemporario = this.jwtService.sign({ email });
    return { token: tokenTemporario };
  }

  async resetPassword(email: string, token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify<{ email: string }>(token);
      console.log('PAYLOAD:', payload);
      if (payload.email !== email) throw new BadRequestException('Token inválido');
    } catch {
      throw new BadRequestException('Token inválido ou expirado');
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.prismaService.user.update({
      where: { email },
      data: { password: hashed },
    });

    return { message: 'Senha cadastrada com sucesso' };
  }
}
