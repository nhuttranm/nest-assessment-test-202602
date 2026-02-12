import { Test, TestingModule } from '@nestjs/testing';
import { PairsService } from '../src/services/pairs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserPair } from '../src/entities/user-pair.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreatePairDto } from '../src/dto/create-pair.dto';

describe('PairsService', () => {
  let service: PairsService;
  let repository: Repository<UserPair>;

  const mockUserPairRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [
        PairsService,
        {
          provide: getRepositoryToken(UserPair),
          useValue: mockUserPairRepository,
        },
      ],
    }).compile();

    service = module.get<PairsService>(PairsService);
    repository = module.get<Repository<UserPair>>(getRepositoryToken(UserPair));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOrCreatePair', () => {
    it('should return existing pair if found in database', async () => {
      const id1 = uuidv4();
      const id2 = uuidv4();
      const existingPair = {
        id: uuidv4(),
        id1,
        id2,
        userID: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      } as UserPair;

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingPair);

      const dto: CreatePairDto = { id1, id2 };
      const result = await service.findOrCreatePair(dto);

      expect(result).toEqual(existingPair);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id1, id2 },
      });
    });

    it('should create new pair if not found in database', async () => {
      const id1 = uuidv4();
      const id2 = uuidv4();
      const newPair = {
        id: uuidv4(),
        id1,
        id2,
        userID: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      } as UserPair;

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'save').mockResolvedValue(newPair);

      const dto: CreatePairDto = { id1, id2 };
      const result = await service.findOrCreatePair(dto);

      expect(result).toEqual(newPair);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id1, id2 },
      });
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id1,
          id2,
        }),
      );
    });
  });
});