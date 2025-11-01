import { Module } from '@nestjs/common';
import { MarkersService } from './markers.service';
import { MarkersController } from './markers.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GeoService } from 'src/geo/geo.service';

@Module({
  imports: [PrismaModule],
  controllers: [MarkersController],
  providers: [MarkersService, GeoService],
  exports: [MarkersService],
})
export class MarkersModule {}
