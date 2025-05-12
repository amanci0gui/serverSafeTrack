import { Module } from '@nestjs/common';
import { MarkersService } from './markers.service';
import { MarkersController } from './markers.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MarkersController],
  providers: [MarkersService],
  exports: [MarkersService]
})
export class MarkersModule {}
