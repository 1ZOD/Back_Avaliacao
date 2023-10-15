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
    async buscarItensPorDia2(body) {
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
    async getAllIcones() {
        const icones = await this.prisma.icone.findMany();
        return icones;
    }
    async cadastrar_habito(data) {
        const calendarioExistente = await this.prisma.calendario.findFirst({
            where: {
                data_inicio: data.data_inicio,
            },
        });
        let iconeId = null;
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
        }
        else {
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
    async excluirTarefaPorDia(requestBody) {
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
    (0, common_1.Post)('dia'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "buscarItensPorDia2", null);
__decorate([
    (0, common_1.Get)('icons'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getAllIcones", null);
__decorate([
    (0, common_1.Post)('cadastrar_habito'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [controller_model_1.Cadastrar_habito]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "cadastrar_habito", null);
__decorate([
    (0, common_1.Post)('excluir'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "excluirTarefaPorDia", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        prisma_service_1.PrismaService])
], AppController);
//# sourceMappingURL=app.controller.js.map