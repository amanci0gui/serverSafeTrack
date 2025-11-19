import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { Role, User } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { IsOptional } from 'class-validator';
import ChangeRoleDto from './dto/change-role.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles('ADMIN')
  @Post('representante')
  createRepresentante(
    @Body() createUserDto: CreateUserDto,
    @CurrentUser() user: User,
  ) {
    return this.userService.createRepresentante(createUserDto, user);
  }

  @Roles('REPRESENTANTE')
  @Post('morador')
  createMorador(
    @Body() createUserDto: CreateUserDto,
    @CurrentUser() user: User,
  ) {
    return this.userService.createMorador(createUserDto, user);
  }

  @Put(':userId/activate-deactivate')
  activateOrDeactivate(@Param('userId') id: number, @CurrentUser() user: User) {
    return this.userService.activateOrDeactivate(id, user);
  }

  @Roles('ADMIN')
  @Put(':userId/change-role')
  changeRole(
    @Param('userId') id: number,
    @Body() dto: ChangeRoleDto,
  ) {
    return this.userService.changeRole(
      id,
      dto.role,
      dto.bairroId ? dto.bairroId : undefined,
    );
  }

  @Roles('REPRESENTANTE', 'ADMIN')
  @Get()
  findAll(@CurrentUser() user: User) {
    return this.userService.findAll(user);
  }

}
