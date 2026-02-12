"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const pairs_controller_1 = require("../src/controllers/pairs.controller");
const pairs_service_1 = require("../src/services/pairs.service");
const uuid_1 = require("uuid");
describe('PairsController', () => {
    let controller;
    let service;
    const mockPairsService = {
        findOrCreatePair: jest.fn(),
        findAll: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [pairs_controller_1.PairsController],
            providers: [
                {
                    provide: pairs_service_1.PairsService,
                    useValue: mockPairsService,
                },
            ],
        }).compile();
        controller = module.get(pairs_controller_1.PairsController);
        service = module.get(pairs_service_1.PairsService);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    describe('createPair', () => {
        it('should return a pair response DTO', async () => {
            const id1 = (0, uuid_1.v4)();
            const id2 = (0, uuid_1.v4)();
            const userID = (0, uuid_1.v4)();
            const mockPair = {
                id: (0, uuid_1.v4)(),
                id1,
                id2,
                userID,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const dto = { id1, id2 };
            jest.spyOn(service, 'findOrCreatePair').mockResolvedValue(mockPair);
            const result = await controller.createPair(dto);
            expect(result).toEqual({
                id1: mockPair.id1,
                id2: mockPair.id2,
                userID: mockPair.userID,
            });
            expect(service.findOrCreatePair).toHaveBeenCalledWith(dto);
        });
    });
    describe('findAll', () => {
        it('should return all pairs', async () => {
            const mockPairs = [
                {
                    id: (0, uuid_1.v4)(),
                    id1: (0, uuid_1.v4)(),
                    id2: (0, uuid_1.v4)(),
                    userID: (0, uuid_1.v4)(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];
            jest.spyOn(service, 'findAll').mockResolvedValue(mockPairs);
            const result = await controller.findAll();
            expect(result).toEqual(mockPairs);
            expect(service.findAll).toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=pairs.controller.spec.js.map