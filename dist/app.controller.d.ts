import { AppService } from './app.service';
import { PrismaService } from './database/prisma.service';
import { Cadastrar_habito } from './model/controller_model';
export declare class AppController {
    private readonly appService;
    private prisma;
    constructor(appService: AppService, prisma: PrismaService);
    empty_page(): Promise<string>;
    cadastrar_habito(data: Cadastrar_habito): Promise<{
        novaTarefa: {
            id: number;
            tarefa: string;
            data_id: number;
            status: string;
        };
    }>;
}
