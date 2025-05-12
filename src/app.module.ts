import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { MapsModule } from './maps/maps.module';
import { MarkersModule } from './markers/markers.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true, // deixa acessível em toda a aplication
  }), PrismaModule, UserModule, AuthModule, MapsModule, MarkersModule],
  controllers: [AppController],
  providers: [AppService, 
    {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },
  {
    provide: APP_GUARD,
    useClass: RolesGuard
  }
],
})
export class AppModule {}
