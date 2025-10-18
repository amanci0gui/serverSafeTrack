import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { Role, User } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { IsOptional } from 'class-validator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @IsPublic() //tornar essa rota pública (sem autenticação)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Put(':userId/activate-deactivate')
  activateOrDeactivate(@Param('userId') id: number, @CurrentUser() user: User) {
    return this.userService.activateOrDeactivate(id, user);
  }

  @Roles('ADMIN')
  @Put(':userId/change-role')
  changeRole(
    @Param('userId') id: number, 
    @Body('role') role: Role,
    @Body('bairroId') bairroId?: number) {
    return this.userService.changeRole(id, role, bairroId ? bairroId : undefined);
  }

}
