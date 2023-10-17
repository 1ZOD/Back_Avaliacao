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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./database/prisma.service");
let AppService = class AppService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async buscarItensPorDia(data_inicio) {
        return this.prisma.tarefa.findMany({
            where: {
                calendario: {
                    data_inicio,
                },
            },
        });
    }
    async getAllIcones() {
        return this.prisma.icone.findMany();
    }
    async cadastrarHabito(data) {
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
    async excluirTarefasConcluidas(dia) {
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
        let iconeId = null;
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
        const calendarioNovo = await this.prisma.calendario.findFirst({
            where: {
                data_inicio: data.data_inicio,
            },
        });
        if (!calendarioNovo) {
            const novoCalendario = await this.prisma.calendario.create({
                data: {
                    data_inicio: data.data_inicio,
                },
            });
            if (novoCalendario) {
                const habit = await this.prisma.tarefa.update({
                    where: { id: Number(id) },
                    data: {
                        nome_tarefa: data.nome_tarefa,
                        descricao: data.descricao,
                        status: data.status,
                        calendario: { connect: { id: novoCalendario.id } },
                        icone: iconeId !== null ? { connect: { id: iconeId } } : undefined,
                        iconeBase64: data.iconeBase64,
                        data_inicio: data.data_inicio,
                        data_fim: data.data_fim,
                        hora_inicio: data.hora_inicio,
                        hora_fim: data.hora_inicio,
                        repetir: data.repetir,
                        notificacao: data.notificacao,
                    },
                });
                return {
                    habit,
                };
            }
            else {
                return {
                    error: 'Erro ao criar novo calendário',
                };
            }
        }
        const tarefaExistente = await this.prisma.tarefa.findUnique({
            where: {
                id: Number(id),
            },
        });
        if (!tarefaExistente) {
            return {
                error: 'Hábito não encontrado',
            };
        }
        const habit = await this.prisma.tarefa.update({
            where: { id: Number(id) },
            data: {
                nome_tarefa: data.nome_tarefa,
                descricao: data.descricao,
                status: data.status,
                calendario: { connect: { id: calendarioNovo.id } },
                icone: iconeId !== null ? { connect: { id: iconeId } } : undefined,
                iconeBase64: data.iconeBase64,
                data_inicio: data.data_inicio,
                data_fim: data.data_fim,
                hora_inicio: data.hora_inicio,
                hora_fim: data.hora_inicio,
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
    async contarTarefas(dataParaContagem) {
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
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AppService);
//# sourceMappingURL=app.service.js.map