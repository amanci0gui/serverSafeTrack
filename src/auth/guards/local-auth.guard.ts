import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  //tratador de erros na hora de gerar o jwt
  handleRequest(err, user) {
    if (err || !user) {
      throw new UnauthorizedException(err?.message);
    }

    return user;
  }
}