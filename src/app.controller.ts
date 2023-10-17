import { Controller, Get, Post, Body, Put, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { Cadastrar, Cadastrar_habito } from './model/controller_model';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('dia')
  async buscarItensPorDia(@Body() body: { data_inicio: string }) {
    const data_inicio = body.data_inicio;
    return this.appService.buscarItensPorDia(data_inicio);
  }

  @Get('icons')
  async getAllIcones() {
    return this.appService.getAllIcones();
  }

  @Post('cadastrar_habito')
  async cadastrar_habito(@Body() data: Cadastrar) {
    return this.appService.cadastrarHabito(data);
  }

  @Post('excluir-concluidas')
  async excluirTarefasConcluidas(@Body() requestBody: { dia: string }) {
    const { dia } = requestBody;
    return this.appService.excluirTarefasConcluidas(dia);
  }

  @Put('habit')
  async editarHabito(@Body() data: Cadastrar_habito) {
    return this.appService.editarHabito(data);
  }

  @Get('get_habit/:id')
  async getHabit(@Param('id') id: string) {
    return this.appService.getHabit(id);
  }

  @Put('concluir_habito/:id')
  async concluirHabito(
    @Param('id') id: string,
    @Body() data: { status: string },
  ) {
    return this.appService.concluirHabito(id, data);
  }

  @Post('contagem')
  async contarTarefas(@Body() data: { data: string }) {
    const { data: dataParaContagem } = data;
    return this.appService.contarTarefas(dataParaContagem);
  }
}
