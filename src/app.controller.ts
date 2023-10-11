import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
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

  @Get('dia/:dia')
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

  @Delete('excluir/:dia/:id')
  async excluirTarefaPorDia(
    @Param('dia') dia: string,
    @Param('id') id: string,
  ) {
    const numeroDoDia = parseInt(dia);
    const numeroDoId = parseInt(id);

    if (isNaN(numeroDoDia) || isNaN(numeroDoId)) {
      throw new Error('Dia ou ID inválido.');
    }
    try {
      await this.prisma.tarefa.delete({
        where: {
          id: numeroDoId,
        },
      });
      return { message: 'Tarefa excluída com sucesso' };
    } catch (error) {
      return {
        error: 'Erro ao excluir a tarefa',
        message: 'Tarefa não encontrada',
      };
    }
  }
}
