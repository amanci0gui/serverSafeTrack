import { Module } from '@nestjs/common';
import { BairroService } from './bairro.service';
import { BairroController } from './bairro.controller';
import { GeoService } from 'src/geo/geo.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BairroController],
  providers: [BairroService, GeoService],
  exports: [BairroService],
})
export class BairroModule {}
