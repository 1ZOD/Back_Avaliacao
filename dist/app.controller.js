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
const controller_model_1 = require("./model/controller_model");
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    async buscarItensPorDia(body) {
        const data_inicio = body.data_inicio;
        return this.appService.buscarItensPorDia(data_inicio);
    }
    async getAllIcones() {
        return this.appService.getAllIcones();
    }
    async cadastrar_habito(data) {
        return this.appService.cadastrarHabito(data);
    }
    async excluirTarefasConcluidas(requestBody) {
        const { dia } = requestBody;
        return this.appService.excluirTarefasConcluidas(dia);
    }
    async editarHabito(data) {
        return this.appService.editarHabito(data);
    }
    async getHabit(id) {
        return this.appService.getHabit(id);
    }
    async concluirHabito(id, data) {
        return this.appService.concluirHabito(id, data);
    }
    async contarTarefas(data) {
        const { data: dataParaContagem } = data;
        return this.appService.contarTarefas(dataParaContagem);
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Post)('dia'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "buscarItensPorDia", null);
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
    __metadata("design:paramtypes", [controller_model_1.Cadastrar]),
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
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map