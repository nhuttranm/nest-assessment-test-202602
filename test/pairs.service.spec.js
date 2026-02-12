"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const pairs_service_1 = require("../src/services/pairs.service");
const typeorm_1 = require("@nestjs/typeorm");
const user_pair_entity_1 = require("../src/entities/user-pair.entity");
const cache_manager_1 = require("@nestjs/cache-manager");
const uuid_1 = require("uuid");
describe('PairsService', () => {
    let service;
    let repository;
    const mockUserPairRepository = {
        findOne: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            imports: [cache_manager_1.CacheModule.register()],
            providers: [
                pairs_service_1.PairsService,
                {
                    provide: (0, typeorm_1.getRepositoryToken)(user_pair_entity_1.UserPair),
                    useValue: mockUserPairRepository,
                },
            ],
        }).compile();
        service = module.get(pairs_service_1.PairsService);
        repository = module.get((0, typeorm_1.getRepositoryToken)(user_pair_entity_1.UserPair));
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('findOrCreatePair', () => {
        it('should return existing pair if found in database', async () => {
            const id1 = (0, uuid_1.v4)();
            const id2 = (0, uuid_1.v4)();
            const existingPair = {
                id: (0, uuid_1.v4)(),
                id1,
                id2,
                userID: (0, uuid_1.v4)(),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            jest.spyOn(repository, 'findOne').mockResolvedValue(existingPair);
            const dto = { id1, id2 };
            const result = await service.findOrCreatePair(dto);
            expect(result).toEqual(existingPair);
            expect(repository.findOne).toHaveBeenCalledWith({
                where: { id1, id2 },
            });
        });
        it('should create new pair if not found in database', async () => {
            const id1 = (0, uuid_1.v4)();
            const id2 = (0, uuid_1.v4)();
            const newPair = {
                id: (0, uuid_1.v4)(),
                id1,
                id2,
                userID: (0, uuid_1.v4)(),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            jest.spyOn(repository, 'findOne').mockResolvedValue(null);
            jest.spyOn(repository, 'save').mockResolvedValue(newPair);
            const dto = { id1, id2 };
            const result = await service.findOrCreatePair(dto);
            expect(result).toEqual(newPair);
            expect(repository.findOne).toHaveBeenCalledWith({
                where: { id1, id2 },
            });
            expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
                id1,
                id2,
            }));
        });
    });
});
//# sourceMappingURL=pairs.service.spec.js.map