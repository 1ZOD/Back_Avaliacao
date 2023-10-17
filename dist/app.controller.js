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
    async excluirTarefasConcluidas(requestBody) {
        const { dia } = requestBody;
        try {
            const tarefasConcluidas = await this.prisma.tarefa.findMany({
                where: {
                    status: {
                        equals: 'concluido',
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
        }
        catch (error) {
            return {
                error: 'Erro ao excluir as tarefas concluídas',
                message: error.message,
            };
        }
    }
    async editarHabito(data) {
        const id = data.id;
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
        let iconeId = null;
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
    async getHabit(id) {
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
    async concluirHabito(id, data) {
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
    async contarTarefas(data) {
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
    (0, common_1.Post)('excluir-concluidas'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "excluirTarefasConcluidas", null);
__decorate([
    (0, common_1.Put)('habit'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [controller_model_1.Cadastrar_habito]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "editarHabito", null);
__decorate([
    (0, common_1.Get)('get_habit/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getHabit", null);
__decorate([
    (0, common_1.Put)('concluir_habito/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "concluirHabito", null);
__decorate([
    (0, common_1.Post)('contagem'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "contarTarefas", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        prisma_service_1.PrismaService])
], AppController);
//# sourceMappingURL=app.controller.js.map