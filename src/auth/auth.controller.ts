import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthRequest } from './models/AuthRequest';
import { IsPublic } from './decorators/is-public.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ApiBody, ApiProperty } from '@nestjs/swagger';
import { VerifyResetTokenDto } from './dto/verify-reset-token.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import ForgotPasswordDto from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  async login(@Request() req: AuthRequest) {
    const user = req.user;
    let message: string | undefined = '';

    if (user.isFirstLogin) {
       const firstLoginResponse = await this.authService.updateFirstLoginStatus(user.id!);
       message = firstLoginResponse?.message;
    } 

    const userLogged = await this.authService.login(user);

    return { ...userLogged, message };
  }

  //Esse endpoint é para quando o usuário sabe a senha antiga e quer trocar
  @Patch('change-password')
  async changePassword(
    @Body() body: ChangePasswordDto,
  ) {
    return this.authService.changePassword(body);
  }

  @IsPublic()
  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body.email);
  }

  @IsPublic()
  @Post('verify-reset-token')
  async verifyResetToken(@Body() body: VerifyResetTokenDto) {
    return this.authService.verifyResetToken(body.email, body.token);
  }

  @IsPublic()
  @Patch('reset-password')
  async resetPassword(
    @Body() body: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(
      body.email,
      body.token,
      body.newPassword,
    );
  }

}
