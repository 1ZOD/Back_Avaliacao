"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const prisma_service_1 = require("./database/prisma.service");
const controller_model_1 = require("./model/controller_model");
let AppController = class AppController {
    constructor(appService, prisma) {
        this.appService = appService;
        this.prisma = prisma;
    }
    async empty_page() {
        return this.appService.getHello();
    }
    async buscarItensPorDia(dia) {
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
    async cadastrar_habito(data) {
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
        }
        else {
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
    async excluirTarefaPorDia(dia, id) {
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
        }
        catch (error) {
            return {
                error: 'Erro ao excluir a tarefa',
                message: 'Tarefa não encontrada',
            };
        }
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "empty_page", null);
__decorate([
    (0, common_1.Get)('dia/:dia'),
    __param(0, (0, common_1.Param)('dia')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "buscarItensPorDia", null);
__decorate([
    (0, common_1.Post)('cadastrar_habito'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [controller_model_1.Cadastrar_habito]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "cadastrar_habito", null);
__decorate([
    (0, common_1.Delete)('excluir/:dia/:id'),
    __param(0, (0, common_1.Param)('dia')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "excluirTarefaPorDia", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        prisma_service_1.PrismaService])
], AppController);
//# sourceMappingURL=app.controller.js.map