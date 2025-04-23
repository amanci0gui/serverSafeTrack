import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt'
import { User } from 'src/user/entities/user.entity';
import { UserPayload } from './models/UserPayload';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './models/UserToken';
import { UnauthorizedError } from './errors/unauthorized.error';

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService, 
    private readonly jwtService: JwtService
  ) {}

  
  login(user: User): UserToken {
    //Transforma o user em um JWT
    const payload: UserPayload = {
      sub: user.id ?? 0,
      email: user.email,
      name: user.name,
      role: user.role
    };

    //gera o token jwt
    const jwtToken = this.jwtService.sign(payload);


    return {
      access_token: jwtToken
    };
  }

  async validateUser(email: string, password: string) {
    const user  = await this.userService.findByEmail(email);

    if(!user?.active) {
      throw new UnauthorizedException('Conta desativada!')
    }

    if (user){
      //Checar se a senha corresponde ao hash no banco
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        return {
          ...user, 
          password: undefined
        }
      }
    }

    //Se chegar aqui, não encontrou o user e/ou senha não corresponde
    throw new Error('Email adress or password provided is incorrect')
  }
}
