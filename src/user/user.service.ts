import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {

  constructor(private readonly prisma: PrismaService){}

  async create(createUserDto: CreateUserDto) {

    //TODO: encrypt password
    const data = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 1)
    }

    //persiste o user criado no banco de dados
    const createdUser = await this.prisma.user.create({ data })


    return {
      ...createdUser,
      password: undefined
    };
  }


  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    })
  }

  async activateOrDeactivate(id: number) {

  const user = await this.prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error('Usuário não encontrado');

  return this.prisma.user.update({
    where: { id },
    data: { active: !user.active },
  });

  
}
}
