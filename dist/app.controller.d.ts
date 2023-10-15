import { AppService } from './app.service';
import { PrismaService } from './database/prisma.service';
import { Cadastrar_habito } from './model/controller_model';
export declare class AppController {
    private readonly appService;
    private prisma;
    constructor(appService: AppService, prisma: PrismaService);
    empty_page(): Promise<string>;
    buscarItensPorDia2(body: {
        data_inicio: string;
    }): Promise<{
        id: number;
        nome_tarefa: string;
        descricao: string;
        status: string;
        data_id: number;
        iconeId: number;
        iconeBase64: string;
        data_inicio: string;
        data_fim: string;
        hora_inicio: string;
        hora_fim: string;
        repetir: string;
        notificacao: string;
    }[]>;
    getAllIcones(): Promise<{
        id: number;
        nome: string;
        url: string;
    }[]>;
    cadastrar_habito(data: Cadastrar_habito): Promise<{
        novaTarefa: {
            id: number;
            nome_tarefa: string;
            descricao: string;
            status: string;
            data_id: number;
            iconeId: number;
            iconeBase64: string;
            data_inicio: string;
            data_fim: string;
            hora_inicio: string;
            hora_fim: string;
            repetir: string;
            notificacao: string;
        };
    }>;
    excluirTarefaPorDia(dia: string, id: string): Promise<{
        message: string;
        error?: undefined;
    } | {
        error: string;
        message: string;
    }>;
}
