import { Controller, Get, Post, Body } from '@nestjs/common';
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

  @Post('dia')
  async buscarItensPorDia2(@Body() body: { data_inicio: string }) {
    const data_inicio = body.data_inicio;
    const itensDoDia = await this.prisma.tarefa.findMany({
      where: {
        calendario: {
          data_inicio: data_inicio,
        },
      },
    });
    return itensDoDia;
  }

  @Get('icons')
  async getAllIcones() {
    const icones = await this.prisma.icone.findMany();
    return icones;
  }

  @Post('cadastrar_habito')
  async cadastrar_habito(@Body() data: Cadastrar_habito) {
    const calendarioExistente = await this.prisma.calendario.findFirst({
      where: {
        data_inicio: data.data_inicio,
      },
    });

    let iconeId: number | null = null;
    let iconeBase64 = '';

    if (data.icone_nome) {
      const iconeExistente = await this.prisma.icone.findFirst({
        where: {
          nome: data.icone_nome,
        },
      });

      if (iconeExistente) {
        iconeId = iconeExistente.id;
        iconeBase64 = iconeExistente.url;
      }
    }

    if (calendarioExistente) {
      const novaTarefa = await this.prisma.tarefa.create({
        data: {
          nome_tarefa: data.nome_tarefa,
          descricao: data.descricao,
          status: data.status,
          calendario: { connect: { id: calendarioExistente.id } },
          icone: { connect: { id: iconeId } },
          iconeBase64: iconeBase64,
          data_inicio: data.data_inicio,
          data_fim: data.data_fim,
          hora_inicio: data.hora_inicio,
          hora_fim: data.hora_fim,
          repetir: data.repetir,
          notificacao: data.notificacao,
        },
      });

      return {
        novaTarefa,
      };
    } else {
      const task = await this.prisma.calendario.create({
        data: {
          data_inicio: data.data_inicio,
        },
      });

      const novaTarefa = await this.prisma.tarefa.create({
        data: {
          nome_tarefa: data.nome_tarefa,
          descricao: data.descricao,
          status: data.status,
          calendario: { connect: { id: task.id } },
          icone: { connect: { id: iconeId } },
          iconeBase64: iconeBase64,
          data_inicio: data.data_inicio,
          data_fim: data.data_fim,
          hora_inicio: data.hora_inicio,
          hora_fim: data.hora_fim,
          repetir: data.repetir,
          notificacao: data.notificacao,
        },
      });

      return {
        novaTarefa,
      };
    }
  }

  @Post('excluir')
  async excluirTarefaPorDia(@Body() requestBody: { dia: string; id: string }) {
    const { dia, id } = requestBody;
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
