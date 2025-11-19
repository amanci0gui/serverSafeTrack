import { Body, Controller, Get, Param } from '@nestjs/common';
import { BairroService } from './bairro.service';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('bairro')
export class BairroController {
  constructor(private readonly bairroService: BairroService) {}

  @Get()
  findAll() {
    return this.bairroService.getBairros();
  }

  @Get(':id')
  findBairroById(@Param('id') id: number) {
    return this.bairroService.getBairroById(id);
  }

  @Get('cidade/:cidade/nome/:nome')
  findBairroByNameAndCidade(
    @Param('cidade') cidade: string,
    @Param('nome') nome: string,
  ) {
    return this.bairroService.getBairroByNameAndCidade(nome, cidade);
  }

  @Get('cidade/:cidade')
  findBairrosByCidade(@Param('cidade') cidade: string) {
    return this.bairroService.getBairrosByCidade(cidade);
  }

  @Get('polygon/:idBairro')
  findPolygonByBairroId(@Param('idBairro') id: number) {
    return this.bairroService.getBairroPolygon(id);
  }

  @IsPublic()
  @Get('centro/:idBairro')
  async findBairroCentroById(@Param('idBairro') id: number) {
    return this.bairroService.getBairroCentroById(id);
  }

}
