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


  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    })
  }

}
