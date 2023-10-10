import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './database/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private prisma: PrismaService,
  ) {}

  @Get('aaa')
  teste(): string {
    return this.appService.getHello();
  }

  @Get('bbb')
  async teste2() {
    const dataFormatoOriginal = new Date('10-10-2023');
    const dataFormatoISO = dataFormatoOriginal.toISOString();

    const member = await this.prisma.calendario.create({
      data: {
        id: 123,
        data: dataFormatoISO,
      },
    });

    return {
      member,
    };
  }
}
