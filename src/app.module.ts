import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './database/prisma.service';

@Module({
  imports: [AppModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
