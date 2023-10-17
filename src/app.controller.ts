import { Controller, Get, Post, Body, Put, Param } from '@nestjs/common';
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
  @Post('excluir-concluidas')
  async excluirTarefasConcluidas(@Body() requestBody: { dia: string }) {
    const { dia } = requestBody;

    try {
      const tarefasConcluidas = await this.prisma.tarefa.findMany({
        where: {
          status: {
            equals: 'concluido', // Use equals para comparação sensível a maiúsculas/minúsculas
          },
          data_inicio: dia,
        },
      });

      if (tarefasConcluidas.length === 0) {
        return {
          message: 'Nenhuma tarefa concluída encontrada para exclusão.',
        };
      }

      for (const tarefa of tarefasConcluidas) {
        await this.prisma.tarefa.delete({
          where: {
            id: tarefa.id,
          },
        });
      }

      return {
        message: 'Tarefas excluídas com sucesso.',
      };
    } catch (error) {
      return {
        error: 'Erro ao excluir as tarefas concluídas',
        message: error.message, // opcional: incluir detalhes do erro
      };
    }
  }

  @Put('habit')
  async editarHabito(@Body() data: Cadastrar_habito) {
    const id = data.id; // Acesse o ID do corpo da solicitação

    // Verifique se o hábito existe com o ID fornecido
    const habitoExistente = await this.prisma.tarefa.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!habitoExistente) {
      return {
        error: 'Hábito não encontrado',
      };
    }

    let iconeId: number | null = null;
    let task = null;

    if (data.icone_nome) {
      const iconeExistente = await this.prisma.icone.findFirst({
        where: {
          nome: data.icone_nome,
        },
      });

      if (iconeExistente) {
        iconeId = iconeExistente.id;
      }
    }

    task = await this.prisma.calendario.findFirst({
      where: {
        data_inicio: data.data_inicio,
      },
    });

    const habit = await this.prisma.tarefa.update({
      where: { id: Number(id) },
      data: {
        nome_tarefa: data.nome_tarefa,
        descricao: data.descricao,
        status: data.status,
        calendario: task ? { connect: { id: task.id } } : undefined,
        icone: iconeId !== null ? { connect: { id: iconeId } } : undefined,
        iconeBase64: data.iconeBase64,
        data_inicio: data.data_inicio,
        data_fim: data.data_fim,
        hora_inicio: data.hora_inicio,
        hora_fim: data.hora_fim,
        repetir: data.repetir,
        notificacao: data.notificacao,
      },
    });

    return {
      habit,
    };
  }

  @Get('get_habit/:id')
  async getHabit(@Param('id') id: string) {
    const habit = await this.prisma.tarefa.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!habit) {
      return {
        error: 'Hábito não encontrado',
      };
    }

    return {
      habit,
    };
  }
  @Put('concluir_habito/:id')
  async concluirHabito(
    @Param('id') id: string,
    @Body() data: { status: string },
  ) {
    const habitoExistente = await this.prisma.tarefa.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!habitoExistente) {
      return {
        error: 'Hábito não encontrado',
      };
    }
    const habit = await this.prisma.tarefa.update({
      where: { id: Number(id) },
      data: {
        status: data.status,
      },
    });

    return {
      habit,
    };
  }

  @Post('contagem')
  async contarTarefas(@Body() data: { data: string }) {
    const { data: dataParaContagem } = data;

    const tarefasNoDia = await this.prisma.tarefa.count({
      where: {
        data_inicio: dataParaContagem,
      },
    });

    const tarefasConcluidasNoDia = await this.prisma.tarefa.count({
      where: {
        data_inicio: dataParaContagem,
        status: 'concluido',
      },
    });

    return {
      totalTarefas: tarefasNoDia,
      tarefasConcluidas: tarefasConcluidasNoDia,
    };
  }
}
