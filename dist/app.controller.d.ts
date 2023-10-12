import { AppService } from './app.service';
import { PrismaService } from './database/prisma.service';
import { Cadastrar_habito } from './model/controller_model';
export declare class AppController {
    private readonly appService;
    private prisma;
    constructor(appService: AppService, prisma: PrismaService);
    empty_page(): Promise<string>;
    buscarItensPorDia2(body: {
        dia: string;
    }): Promise<{
        id: number;
        tarefa: string;
        data_id: number;
        status: string;
    }[]>;
    cadastrar_habito(data: Cadastrar_habito): Promise<{
        novaTarefa: {
            id: number;
            tarefa: string;
            data_id: number;
            status: string;
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
