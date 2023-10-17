import { PrismaService } from './database/prisma.service';
import { Cadastrar, Cadastrar_habito } from './model/controller_model';
export declare class AppService {
    private prisma;
    constructor(prisma: PrismaService);
    buscarItensPorDia(data_inicio: string): Promise<{
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
    cadastrarHabito(data: Cadastrar): Promise<{
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
    excluirTarefasConcluidas(dia: string): Promise<{
        message: string;
        error?: undefined;
    } | {
        error: string;
        message: any;
    }>;
    editarHabito(data: Cadastrar_habito): Promise<{
        habit: {
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
        error?: undefined;
    } | {
        error: string;
        habit?: undefined;
    }>;
    getHabit(id: string): Promise<{
        error: string;
        habit?: undefined;
    } | {
        habit: {
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
        error?: undefined;
    }>;
    concluirHabito(id: string, data: {
        status: string;
    }): Promise<{
        error: string;
        habit?: undefined;
    } | {
        habit: {
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
        error?: undefined;
    }>;
    contarTarefas(dataParaContagem: string): Promise<{
        totalTarefas: number;
        tarefasConcluidas: number;
    }>;
}
