import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role, User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createRepresentante(createUserDto: CreateUserDto, user: User) {
    if (user.role !== 'ADMIN') throw new UnauthorizedException('Apenas administradores podem criar representantes.');

    const userExists = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (userExists) throw new ForbiddenException('Já existe um usuário cadastrado com esse e-mail.');

    if (createUserDto.role !== 'REPRESENTANTE') throw new ForbiddenException('O papel do usuário deve ser REPRESENTANTE ao criar um representante.');

    const bairroDoRepresentante = await this.prisma.bairro.findUnique({
      where: { id: createUserDto.bairroId },
    });

    if (!bairroDoRepresentante) throw new NotFoundException('Bairro não encontrado.');

    if (bairroDoRepresentante.adminId) throw new ForbiddenException('O bairro já possui um representante associado.');

    const data = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 1),
    };

    const result = await this.prisma.$transaction(async (prisma) => {
      const createdUser = await prisma.user.create({ data });
      
      const updatedBairro = await prisma.bairro.update({
        where: { id: createUserDto.bairroId },
        data: { adminId: createdUser.id },
      });

      return { createdUser, updatedBairro };
    });

    return {
      ...result.createdUser,
      password: undefined,
      bairro: result.updatedBairro,
    };
  }

  async createMorador(createUserDto: CreateUserDto, user: User) {
    if (user.role !== 'REPRESENTANTE') {
      throw new UnauthorizedException('Apenas representantes podem criar moradores.');
    }

    const userExists = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (userExists) throw new ForbiddenException('Já existe um usuário cadastrado com esse e-mail.');

    // Busca o representante completo do banco para garantir que temos o bairroId
    const representante = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, bairroId: true, role: true, active: true },
    });

    if (!representante?.bairroId) {
      throw new ForbiddenException('O representante não está associado a nenhum bairro.');
    }

    const bairroDoMorador = await this.prisma.bairro.findUnique({
      where: { id: representante.bairroId },
    });

    if (!bairroDoMorador) throw new NotFoundException('Bairro não encontrado.');

    const data = {
      ...createUserDto,
      bairroId: representante.bairroId, // Usa o bairroId do representante
      password: await bcrypt.hash(createUserDto.password, 1),
    };

    const createdUser = await this.prisma.user.create({ data });

    return {
      ...createdUser,
      password: undefined,
      bairro: bairroDoMorador,
    };
  }

  async create(createUserDto: CreateUserDto, user: User) {
    //verifica se o usuário que está criando o novo usuário é admin ou representante
    if (user.role !== 'ADMIN' && user.role !== 'REPRESENTANTE') {
      throw new UnauthorizedException('Apenas administradores e representantes podem criar usuários.');
    }

    const userExists = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    })

    if (userExists) throw new ForbiddenException('Já existe um usuário cadastrado com esse e-mail.');

    if (createUserDto.role === 'ADMIN' && user.role !== 'ADMIN') {
      throw new ForbiddenException('Apenas administradores podem criar administradores.');
    }

    if (createUserDto.role === 'USER' && !createUserDto.bairroId) {
      throw new ForbiddenException('Para criar um usuário comum, é necessário associá-lo a um bairro.');
    }

    const bairroDoRepresentante = await this.prisma.bairro.findUnique({
      where: { adminId: user.id },
    });

    //TODO: encrypt password
    const data = {
      ...createUserDto,
      bairroId: bairroDoRepresentante?.id,
      password: await bcrypt.hash(createUserDto.password, 1),
    };

    //persiste o user criado no banco de dados
    const createdUser = await this.prisma.user.create({ data });

    return {
      ...createdUser,
      password: undefined,
    };
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async activateOrDeactivate(id: number, user: User) {
    if (user.id !== id && user.role !== 'ADMIN')
      throw new UnauthorizedException(
        'Permissão negada, apennas administradores ou o próprio usuário podem ativar/desativar contas.',
      );

    const userToBeUpdated = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!userToBeUpdated) throw new NotFoundException('Usuário não encontrado');

    return this.prisma.user.update({
      where: { id },
      data: { active: !userToBeUpdated.active },
    });
  }

  async changeRole(id: number, role: Role, bairroId?: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    if (role !== 'REPRESENTANTE') {
      return this.prisma.user.update({
        where: { id },
        data: { role },
      });
    }

    return this.addsRoleRepresentanteAndBairroToUser(user, bairroId!);
  }

  async addsRoleRepresentanteAndBairroToUser(user: User, bairroId: number) {
    const id = user.id;
    const role = user.role;

    //se for representante, precisa setar o bairroId
    if (!bairroId) {
      throw new ForbiddenException(
        'Para alterar o papel do usuário para REPRESENTANTE, é necessário fornecer o bairroId correspondente.',
      );
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
      throw new ForbiddenException(
        'Usuário já é administrador de outro bairro ou o bairro já tem representante.',
      );
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
