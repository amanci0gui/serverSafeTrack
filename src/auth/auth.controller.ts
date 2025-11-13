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

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  login(@Request() req: AuthRequest) {
    return this.authService.login(req.user);
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
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @IsPublic()
  @Post('verify-reset-token')
  async verifyResetToken(@Body() body: { email: string; token: string }) {
    return this.authService.verifyResetToken(body.email, body.token);
  }

  @IsPublic()
  @Patch('reset-password')
  async resetPassword(
    @Body() body: { email: string; token: string; newPassword: string },
  ) {
    return this.authService.resetPassword(
      body.email,
      body.token,
      body.newPassword,
    );
  }

}
