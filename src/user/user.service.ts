import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt'
import { Role, User } from '@prisma/client';

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

  async activateOrDeactivate(id: number, user: User) {

    if (user.id !== id && user.role !== 'ADMIN') throw new UnauthorizedException('Permissão negada, apennas administradores ou o próprio usuário podem ativar/desativar contas.');

    const userToBeUpdated = await this.prisma.user.findUnique({ where: { id } });
    if (!userToBeUpdated) throw new NotFoundException('Usuário não encontrado');

    return this.prisma.user.update({
      where: { id },
      data: { active: !userToBeUpdated.active },
    });
}

  async changeRole(id: number, role: Role, bairroId?: number) {

    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    if (role !== 'REPRESENTANTE'){
      return this.prisma.user.update({
        where: { id },
        data: { role },
    });
    }

    //se for representante, precisa setar o bairroId
    if (!bairroId) {
      throw new ForbiddenException('Para alterar o papel do usuário para REPRESENTANTE, é necessário fornecer o bairroId correspondente.');
    }

    //verifica se o bairro já tem um representante associado
    const bairro = await this.prisma.bairro.findUnique({
      where: { id: bairroId },
    });

    if (!bairro) throw new NotFoundException('Bairro não encontrado.');

    //verifica se o representante já está associado a outro bairro 
    const representanteTemBairro = await this.prisma.bairro.findUnique({
      where: { adminId: id },
    });

    const bairroTemRepresentante = !!bairro.adminId;

    if (representanteTemBairro || bairroTemRepresentante) {
      throw new ForbiddenException('Usuário já é administrador de outro bairro ou o bairro já tem representante.');
    }

    // Realiza a transação para garantir a atomicidade das operações de atualização
    const [updatedBairro, updatedUser] = await this.prisma.$transaction([
      this.prisma.bairro.update({
        where: { id: bairroId },
        data: { adminId: id },
      }),
      this.prisma.user.update({
        where: { id },
        data: { role },
      }),
    ]);

    return {
      message: 'Papel alterado com sucesso!',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        role: updatedUser.role,
      },
      bairro: {
        id: updatedBairro.id,
        name: updatedBairro.name,
        adminId: updatedBairro.adminId,
      },
    };

    
  }
}
