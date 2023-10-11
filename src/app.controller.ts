import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './database/prisma.service';
import { Cadastrar_habito } from './model/controller_model';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private prisma: PrismaService,
  ) {}

  @Get()
  async empty_page() {
    return this.appService.getHello();
  }

  @Get(':dia')
  async buscarItensPorDia(@Param('dia') dia: string) {
    const numeroDoDia = parseInt(dia);
    if (isNaN(numeroDoDia)) {
      throw new Error('Dia inválido.');
    }
    const itensDoDia = await this.prisma.tarefa.findMany({
      where: {
        calendario: {
          dia: numeroDoDia,
        },
      },
    });
    return itensDoDia;
  }

  @Post('cadastrar_habito')
  async cadastrar_habito(@Body() data: Cadastrar_habito) {
    const calendarioExistente = await this.prisma.calendario.findFirst({
      where: {
        dia: data.dia,
      },
    });

    if (calendarioExistente) {
      const novaTarefa = await this.prisma.tarefa.create({
        data: {
          tarefa: 'Tarefa 1',
          status: 'Em andamento',
          calendario: { connect: { id: calendarioExistente.id } },
        },
      });

      return {
        novaTarefa,
      };
    } else {
      // Se o Calendario não existe, crie-o e, em seguida, crie a Tarefa
      const task = await this.prisma.calendario.create({
        data: {
          dia: data.dia,
        },
      });

      const novaTarefa = await this.prisma.tarefa.create({
        data: {
          tarefa: 'Tarefa 1',
          status: 'Em andamento',
          calendario: { connect: { id: task.id } },
        },
      });

      return {
        novaTarefa,
      };
    }
  }

  // @Get('bbb')
  // async teste2() {
  //   const dataFormatoOriginal = new Date('10-10-2023');
  //   const dataFormatoISO = dataFormatoOriginal.toISOString();

  //   const member = await this.prisma.calendario.create({
  //     data: {
  //       id: 123,
  //       data: dataFormatoISO,
  //     },
  //   });

  //   return {
  //     member,
  //   };
  // }
}
