import { AppService } from './app.service';
import { PrismaService } from './database/prisma.service';
export declare class AppController {
    private readonly appService;
    private prisma;
    constructor(appService: AppService, prisma: PrismaService);
    teste(): string;
    teste2(): Promise<{
        member: {
            id: number;
            data: Date;
        };
    }>;
}
