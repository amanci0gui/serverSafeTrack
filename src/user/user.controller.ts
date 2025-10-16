import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @IsPublic() //tornar essa rota pública (sem autenticação)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Put(':userId/activate-deactivate')
  activateOrDeactivate(@Param('userId') id: number) {
    return this.userService.activateOrDeactivate(id);
  }
}
