import { Body, Controller, Get, Param } from '@nestjs/common';
import { BairroService } from './bairro.service';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('bairro')
export class BairroController {
  constructor(private readonly bairroService: BairroService) {}

  @Get()
  async findAll() {
    return await this.bairroService.getBairros();
  }

  @Get(':id')
  async findBairroById(@Param('id') id: number) {
    return await this.bairroService.getBairroById(id);
  }

  @IsPublic()
  @Get('cidade/:cidade/nome/:nome')
  async findBairroByNameAndCidade(
    @Param('cidade') cidade: string,
    @Param('nome') nome: string,
  ) {
    return await this.bairroService.getBairroByNameAndCidade(nome, cidade);
  }

  @Get('cidade/:cidade')
  async findBairrosByCidade(@Param('cidade') cidade: string) {
    return await this.bairroService.getBairrosByCidade(cidade);
  }

  @Get('polygon/:idBairro')
  async findPolygonByBairroId(@Param('idBairro') id: number) {
    return await this.bairroService.getBairroPolygon(id);
  }

  @Get('centro/:idBairro')
  async findBairroCentroById(@Param('idBairro') id: number) {
    return await this.bairroService.getBairroCentroById(id);
  }

}
